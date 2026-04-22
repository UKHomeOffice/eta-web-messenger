import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router';
import Eta from '../../src/routes/index';
import config from '../../config';
import logData from '../../src/utils/logging';

let mockGenesysProps;

jest.mock('react-router', () => {
  const actual = jest.requireActual('react-router');
  return {
    ...actual,
    useNavigate: jest.fn()
  };
});

jest.mock('hof-genesys-chat-component', () => ({
  GenesysChatComponent: (props) => {
    mockGenesysProps = props;
    return <div data-testid="genesys-chat-component">Genesys chat component</div>;
  }
}));

jest.mock('@hods/loading-spinner', () => () => <div data-testid="loading-spinner">Loading spinner</div>);

jest.mock('../../src/components/content/page-heading', () => ({
  __esModule: true,
  default: ({ serviceName, serviceSubText }) => (
    <div>
      <h1>{`Home Office ${serviceName} Chat`}</h1>
      <p>{`Ask our digital assistant about ${serviceSubText}`}</p>
    </div> 
  )
}));

jest.mock('../../src/components/error/error-component', () => ({
  __esModule: true,
  default: ({ contactFormLink }) => (
    <div>
      <h1>Something went wrong</h1>
      <a data-testid="error-contact-form" href={contactFormLink}>Contact form</a>
    </div>
  )
}));

jest.mock('../../src/utils/logging', () => ({
  __esModule: true,
  default: jest.fn()
}));

const renderComponentWithRouter = (component) => render(
  <MemoryRouter>
    {component}
  </MemoryRouter>
);

describe('Eta page', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockGenesysProps = undefined;
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders ETA page with correct content', () => {
    renderComponentWithRouter(<Eta />);

    const heading = screen.getByRole('heading');
    expect(heading).toHaveTextContent('Home Office ETA Chat');
    expect(heading).toHaveTextContent(config.service.name);
    expect(screen.getByTestId('genesys-chat-component')).toBeInTheDocument();
  });

  test('passes required props to GenesysChatComponent', () => {
    renderComponentWithRouter(<Eta />);

    expect(mockGenesysProps).toEqual(expect.objectContaining({
      genesysEnvironment: config.service.environment,
      deploymentId: config.service.deploymentId,
      loggingCallback: logData,
      serviceMetadata: expect.objectContaining({
        serviceName: config.service.name,
        agentConnectedText: config.bannerTypeDisplay.human,
        agentDisconnectedText: config.bannerTypeDisplay.agentDisconnected,
        offlineText: config.bannerTypeDisplay.offline,
        onlineText: config.bannerTypeDisplay.online,
        botMetaDisplay: config.botMetaDisplay,
      })
    }));
    expect(mockGenesysProps.loadingSpinner).toBeTruthy();
  });

  test('renders ETA error content when error callback occurs', async () => {
    renderComponentWithRouter(<Eta />);

    await act(async () => {
      mockGenesysProps.errorCallback();
    });

    expect(screen.getByRole('heading')).toHaveTextContent('Something went wrong');
    expect(screen.getByTestId('error-contact-form')).toHaveAttribute('href', config.service.errorContactLink);
  });

  test('navigates to end chat confirmation when chat ends', async () => {
    renderComponentWithRouter(<Eta />);

    await act(async () => {
      mockGenesysProps.onChatEnded();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/end-chat-confirmation');
  });
});
