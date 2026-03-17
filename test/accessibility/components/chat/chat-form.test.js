import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import ChatForm from '../../../../src/components/chat/chat-form';

const { axe, toHaveNoViolations } = require('jest-axe');
expect.extend(toHaveNoViolations);

describe('ChatForm component', () => {
  test('renders ChatForm component with no accessibility violations', async () => {
    const { container } = render(
      <ChatForm
        inputMessage="Testing"
        setInputMessage={() => { }}
        sendMessage={() => { }}
        handleKeyPress={() => { }}
      />
    );
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
