import '@testing-library/jest-dom';
import { renderOutboundMessageComponent } from '../../../../render';
const { axe, toHaveNoViolations } = require('jest-axe');
const messages = require('../../../../inbound-messages.json');

expect.extend(toHaveNoViolations);

describe('OutboundMessage component', () => {

  test('renders OutboundMessage component with no accessibility violations', async () => {
    const { container } = renderOutboundMessageComponent(messages[0]);
    const result = await axe(container);

    expect(result).toHaveNoViolations();
  });


  it('should render Outbound message with right attributes for screen reader support', async () => {
    const { container, getAllByRole } = renderOutboundMessageComponent(messages[0]);


    // Check each message has role="article" and correct aria-label
    const articles = getAllByRole('article');
    expect(articles).toHaveLength(1);
    expect(articles[0]).toHaveAttribute('aria-label', 'Outbound message');
    expect(articles[0]).toHaveAttribute('data-testid', 'outbound-message');

    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
