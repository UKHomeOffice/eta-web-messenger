jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-conversation-id')
}));

import '@testing-library/jest-dom';
import { 
  getConversationId, 
  removeConversationId
} from '../../src/conversation/conversation-storage';

describe('Conversation Storage', () => {
  test('should get conversation ID storage', () => {
    const conversationId = getConversationId();
    expect(conversationId).toBe('test-conversation-id');
  });

  test('should remove conversation ID from storage', () => {
    sessionStorage.setItem('conversationId', 'to-be-removed-id');
    expect(sessionStorage.getItem('conversationId')).toBe('to-be-removed-id');

    removeConversationId();

    expect(sessionStorage.getItem('conversationId')).toBeNull();
  });
});
