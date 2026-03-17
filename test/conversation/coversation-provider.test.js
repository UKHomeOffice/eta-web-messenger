jest.mock('../../src/conversation/conversation-storage', () => {
  return {
    getConversationId: jest.fn(() => 'test-conversation-id'),
  };
});

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ConversationProvider, useConversationId } from '../../src/conversation/conversation-provider';

describe('Conversation Provider', () => {
  test('should provide conversation ID from context', () => {
    const TestComponent = () => {
      const conversationId = useConversationId();
      return <div data-testid='conversation-id'>{conversationId}</div>;
    };

    const expectedConversationId = 'test-conversation-id';
    
    render(
      <ConversationProvider>
        <TestComponent />
      </ConversationProvider>
    );

    expect(screen.getByTestId('conversation-id')).toBeInTheDocument();
    expect(screen.getByTestId('conversation-id')).toHaveTextContent(expectedConversationId);
  });
});
