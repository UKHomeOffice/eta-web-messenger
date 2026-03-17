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
import Euss from '../../src/routes/euss';
import { 
  initialiseGenesysConversation,
  subscribeToErrors,
  subscribeToGenesysMessages
} from '../../src/genesys/genesys-service.js';
import { ErrorBoundary } from '../../src/error/error-boundary.js';

const renderComponentWithRouter = (component) => render(
  <MemoryRouter>
    <ErrorBoundary contactFormLink="https://eu-settled-status-enquiries.service.gov.uk/start">
      {component}
    </ErrorBoundary>
  </MemoryRouter>
);

describe('Euss page', () => {
  test('renders EUSS page with correct content', () => {
    renderComponentWithRouter(<Euss />);

    const headings = screen.getAllByRole('heading');
    expect(headings[0]).toHaveTextContent('Home Office EUSS Chat');
    expect(headings[1]).toHaveTextContent('Loading web chat');

    const subText = screen.getByText(/Ask our/i);
    expect(subText).toHaveTextContent('Ask our digital assistant about the EUSS (EU Settlement Service).');
  });

  test('renders EUSS specific error content when application error occurs', async () => {
    // Mock the Genesys window object 
    window.Genesys = {};
  
    initialiseGenesysConversation.mockImplementation((onGenesysReady) => {
      onGenesysReady();
    });
  
    // Simulate receiving a bad message from the Genesys (direction case sensitivity)
    subscribeToGenesysMessages.mockImplementation((onMessage) => {
      onMessage([{
        'Direction': 'Outbound',
        'text': 'Welcome to EUSS webchat, in few word how can i help you today?',
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
  
    renderComponentWithRouter(<Euss />);
  
    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('Something went wrong');
  
    const errorMessage = screen.getByText(/Please try again in a/i);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Please try again in a few minutes or use our contact form. We will reply in 3 to 5 working days.');
    expect(errorMessage.querySelector('a')).toHaveAttribute('href', 'https://eu-settled-status-enquiries.service.gov.uk/start');
  });

  test('renders EUSS specific error content when Genesys error occurs', async () => {
    // Mock the Genesys window object 
    window.Genesys = {};

    initialiseGenesysConversation.mockImplementation((onGenesysReady) => {
      onGenesysReady();
    });

    subscribeToErrors.mockImplementation((onError) => {
      onError();
    });

    renderComponentWithRouter(<Euss />);

    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('Something went wrong');

    const errorMessage = screen.getByText(/Please try again in a/i);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Please try again in a few minutes or use our contact form. We will reply in 3 to 5 working days.');
    expect(errorMessage.querySelector('a')).toHaveAttribute('href', 'https://eu-settled-status-enquiries.service.gov.uk/start');
  });
});
