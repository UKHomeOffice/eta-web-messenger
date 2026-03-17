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
import Evisa from '../../src/routes/evisa.js';
import {
  initialiseGenesysConversation,
  subscribeToErrors,
  subscribeToGenesysMessages
} from '../../src/genesys/genesys-service.js';
import { ErrorBoundary } from '../../src/error/error-boundary.js';

const renderComponentWithRouter = (component) => render(
  <MemoryRouter>
    <ErrorBoundary contactFormLink="https://www.ask-about-getting-access-evisa.homeoffice.gov.uk/start">
      {component}
    </ErrorBoundary>
  </MemoryRouter>
);

describe('eVisa page', () => {
  test('renders eVisa page with correct content', () => {
    renderComponentWithRouter(<Evisa />);

    const headings = screen.getAllByRole('heading');
    expect(headings[0]).toHaveTextContent('Home Office eVisa Chat');
    expect(headings[1]).toHaveTextContent('Loading web chat');

    const subText = screen.getByText(/Ask our/i);
    expect(subText).toHaveTextContent('Ask our digital assistant about an eVisa.');
  });

  test('renders eVisa specific error content when application error occurs', async () => {
    // Mock the Genesys window object 
    window.Genesys = {};

    initialiseGenesysConversation.mockImplementation((onGenesysReady) => {
      onGenesysReady();
    });

    // Simulate receiving a bad message from the Genesys (direction case sensitivity)
    subscribeToGenesysMessages.mockImplementation((onMessage) => {
      onMessage([{
        'Direction': 'Outbound',
        'text': 'Welcome to eVisa webchat, in few word how can i help you today?',
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

    renderComponentWithRouter(<Evisa />);

    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('Something went wrong');

    const errorMessage = screen.getByText(/Please try again in a/i);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Please try again in a few minutes or use our contact form. We will reply in 3 to 5 working days.');
    expect(errorMessage.querySelector('a')).toHaveAttribute('href', 'https://www.ask-about-getting-access-evisa.homeoffice.gov.uk/start');
  });

  test('renders eVisa specific error content when Genesys error occurs', async () => {
    // Mock the Genesys window object 
    window.Genesys = {};

    initialiseGenesysConversation.mockImplementation((onGenesysReady) => {
      onGenesysReady();
    });

    subscribeToErrors.mockImplementation((onError) => {
      onError();
    });

    renderComponentWithRouter(<Evisa />);

    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('Something went wrong');

    const errorMessage = screen.getByText(/Please try again in a/i);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Please try again in a few minutes or use our contact form. We will reply in 3 to 5 working days.');
    expect(errorMessage.querySelector('a')).toHaveAttribute('href', 'https://www.ask-about-getting-access-evisa.homeoffice.gov.uk/start');
  });
});
