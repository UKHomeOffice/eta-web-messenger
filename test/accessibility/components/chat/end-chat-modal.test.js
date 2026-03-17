import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import EndChatModal from '../../../../src/components/chat/end-chat-modal';

const { axe, toHaveNoViolations } = require('jest-axe');
expect.extend(toHaveNoViolations);

// Mock the dialog prototype methods as JSDOM does not implement them
beforeAll(() => {
  window.HTMLDialogElement.prototype.showModal = jest.fn();
  window.HTMLDialogElement.prototype.close = jest.fn();
});

describe('EndChatModal component', () => {
  test('renders EndChatModal component with no accessibility violations', async () => {
    const { container } = render(
      <EndChatModal
        showModal={true}
        handleCloseModal={() => {}}
        handleEndChat={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
