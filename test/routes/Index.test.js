jest.mock('../../src/genesys/genesys-service.js', () => ({
  loadGenesysScript: jest.fn(),
  subscribeAgentTyping: jest.fn(),
  unSubscribeAgentTyping: jest.fn(),
  initialiseGenesysConversation: jest.fn(),
  subscribeToGenesysMessages: jest.fn(),
  subscribeToGenesysOldMessages: jest.fn(),
  subscribeToSessionRestored: jest.fn(),
  subscribeToGenesysOffline: jest.fn(),
  subscribeToGenesysReconnected: jest.fn(),
  subscribeToErrors: jest.fn(),
}));

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Eta from '../../src/routes/index';
import {
  initialiseGenesysConversation,
  subscribeToErrors,
  subscribeToGenesysMessages
} from '../../src/genesys/genesys-service.js';
import { ErrorBoundary } from '../../src/error/error-boundary.js';

const renderComponentWithRouter = (component) => render(
  <MemoryRouter>
    <ErrorBoundary>
      {component}
    </ErrorBoundary>
  </MemoryRouter>
);

describe('Eta page', () => {
  test('renders ETA page with correct content', () => {
    renderComponentWithRouter(<Eta />);

    const headings = screen.getAllByRole('heading');
    expect(headings[0]).toHaveTextContent('Home Office ETA Chat');
    expect(headings[1]).toHaveTextContent('Loading web chat');

    const subText = screen.getByText(/Ask our/i);
    expect(subText).toHaveTextContent('Ask our digital assistant about an ETA');
  });

  test('renders ETA specific error content when application error occurs due to unexpected Genesys content', async () => {
    // Mock the Genesys window object 
    window.Genesys = {};

    initialiseGenesysConversation.mockImplementation((onGenesysReady) => {
      onGenesysReady();
    });

    // Simulate receiving a bad message from the Genesys (direction case sensitivity)
    subscribeToGenesysMessages.mockImplementation((onMessage) => {
      onMessage([{
        'Direction': 'Outbound',
        'text': 'Welcome to ETA webchat, in few word how can i help you today?',
        'type': 'Text',
        'channel': {
          'time': '2025-07-31T09:38:00Z'
        },
        'metadata': {
          'correlationId': '00000000-0000-0000-0000-000000000000'
        },
        'originatingEntity': 'Bot',
        'content': []
      }]);
    });

    renderComponentWithRouter(<Eta />);

    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('Something went wrong');

    const errorMessage = screen.getByText(/Please try again in a/i);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Please try again in a few minutes or use our contact form. We will reply in 3 to 5 working days.');
    expect(errorMessage.querySelector('a')).toHaveAttribute('href', 'https://www.ask-question-about-electronic-travel-authorisation.homeoffice.gov.uk');
  });

  test('renders ETA specific error content when Genesys error occurs', async () => {
    // Mock the Genesys window object 
    window.Genesys = {};

    initialiseGenesysConversation.mockImplementation((onGenesysReady) => {
      onGenesysReady();
    });

    subscribeToErrors.mockImplementation((onError) => {
      onError();
    });

    renderComponentWithRouter(<Eta />);

    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('Something went wrong');

    const errorMessage = screen.getByText(/Please try again in a/i);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Please try again in a few minutes or use our contact form. We will reply in 3 to 5 working days.');
    expect(errorMessage.querySelector('a')).toHaveAttribute('href', 'https://www.ask-question-about-electronic-travel-authorisation.homeoffice.gov.uk');
  });
});
