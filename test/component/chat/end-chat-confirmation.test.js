import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import EndChatConfirmation from '../../../src/components/chat/end-chat-confirmation';

describe('EndChatConfirmation component', () => {

  function renderComponent() {
    render(
      <MemoryRouter>
        <EndChatConfirmation />
      </MemoryRouter>
    );
  }

  test('renders new chat link back to chat view', () => {
    renderComponent();

    const newChatLink = screen.getByText('start a new chat');

    expect(newChatLink).toHaveAttribute('href', '/');
  });
});
