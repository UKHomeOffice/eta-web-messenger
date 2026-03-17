import { axe, toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';
import { renderMessagesComponent } from '../../../render';
const inboundMessages = require('../../../inbound-messages.json');
const outboundMessages = require('../../../outbound-messages.json');
const restoredMessages = require('../../../restored-messages.json');

const messages = outboundMessages.concat(inboundMessages);

expect.extend(toHaveNoViolations);

describe('Message component - screen reader accessibility', () => {

  it('should render messages and use appropriate roles and ARIA attributes for screen reader support', async () => {
    const { container, getByRole, getAllByRole } = renderMessagesComponent(messages, restoredMessages);
    // Check the outer log role
    const log = getByRole('log');
    expect(log).toHaveAttribute('aria-live', 'polite');
    expect(log).toHaveAttribute('aria-relevant', 'additions text');
    expect(log).toHaveAttribute('aria-label', 'Chat messages');

    // Check each message has role="article" and correct aria-label
    const articles = getAllByRole('article');
    expect(articles).toHaveLength(9);
    expect(articles[0]).toHaveAttribute('aria-label', 'Outbound message');
    expect(articles[6]).toHaveAttribute('aria-label', 'Inbound message');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Message accessibility', () => {
  it('should have no accessibility violations with valid messages', async () => {
    const { container } = renderMessagesComponent(messages, restoredMessages);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when messages are empty', async () => {
    const { container } = renderMessagesComponent([], restoredMessages);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
