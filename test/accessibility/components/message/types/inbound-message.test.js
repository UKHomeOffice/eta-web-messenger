import '@testing-library/jest-dom';
import { renderInboundMessageComponent } from '../../../../render';
const { axe, toHaveNoViolations } = require('jest-axe');
const messages = require('../../../../inbound-messages.json');

expect.extend(toHaveNoViolations);

describe('InboundMessage component', () => {

  test('renders InboundMessage component with no accessibility violations', async () => {
    const { container } = renderInboundMessageComponent(messages[1]);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it('should render Inbound message with right attributes for screen reader support', async () => {
    const { container, getAllByRole } = renderInboundMessageComponent(messages[0]);


    // Check each message has role="article" and correct aria-label
    const articles = getAllByRole('article');
    expect(articles).toHaveLength(1);
    expect(articles[0]).toHaveAttribute('aria-label', 'Inbound message');
    expect(articles[0]).toHaveAttribute('data-testid', 'inbound-message');

    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
