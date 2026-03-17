import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import EndChatConfirmation from '../../../src/components/chat/end-chat-confirmation';

describe('EndChatConfirmation component', () => {

  function renderComponentWithRouterState(state) {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/end-chat-confirmation', state }]}>
        <EndChatConfirmation />
      </MemoryRouter>
    );
  }

  test.each([
    'eta',
    'evisa',
    'euss'
  ])('renders correct feedback and new chat links for service %s', (serviceName) => {

    const state = { serviceName: serviceName };
    window.history.pushState(state, '', '/end-chat-confirmation');

    renderComponentWithRouterState(state);

    const newChatLink = screen.getByText('start a new chat');

    expect(newChatLink).toHaveAttribute('href', `/${serviceName}`);    
  });

  test('throws error for invalid service name', () => {
    const state = { serviceName: 'invalid-service' };
    window.history.pushState(state, '', '/end-chat-confirmation');

    try {
      renderComponentWithRouterState(state);
    } catch (error) {
      expect(error.message).toBe('Invalid service name provided');
    }
  });
});
