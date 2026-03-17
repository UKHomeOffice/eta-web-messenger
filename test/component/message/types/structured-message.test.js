import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StructuredMessage from '../../../../src/components/message/types/structured-message';

const structuredMessages = require('../../../structured-messages.json');

describe('StructuredMessage component', () => {
  test('renders StructuredMessage components with correct button content', async () => {
    render(
      <StructuredMessage
        contents={structuredMessages[0].content}
        handleQuickReply={() => {}}
      />
    );

    const quickReplyButtons = screen.getAllByRole('button');
    expect(quickReplyButtons).toHaveLength(2);
    expect(quickReplyButtons[0]).toHaveTextContent('Yes');
    expect(quickReplyButtons[1]).toHaveTextContent('No');
  });

  test('handles Yes button being clicked', async () => {
    
    const mockHandleReply = jest.fn();

    render(
      <StructuredMessage
        contents={structuredMessages[0].content}
        handleQuickReply={mockHandleReply}
      />
    );

    const quickReplyButtons = screen.getAllByRole('button');
    expect(quickReplyButtons).toHaveLength(2);
    expect(quickReplyButtons[0]).toHaveTextContent('Yes');
    expect(quickReplyButtons[1]).toHaveTextContent('No');

    const user = userEvent.setup();
    await user.click(quickReplyButtons[0]);
    expect(mockHandleReply).toHaveBeenCalledTimes(1);
  });

  test('handles No button being clicked', async () => {
    
    const mockHandleReply = jest.fn();

    render(
      <StructuredMessage
        contents={structuredMessages[0].content}
        handleQuickReply={mockHandleReply}
      />
    );

    const quickReplyButtons = screen.getAllByRole('button');
    expect(quickReplyButtons).toHaveLength(2);
    expect(quickReplyButtons[0]).toHaveTextContent('Yes');
    expect(quickReplyButtons[1]).toHaveTextContent('No');

    const user = userEvent.setup();
    await user.click(quickReplyButtons[1]);
    expect(mockHandleReply).toHaveBeenCalledTimes(1);
  });
});
