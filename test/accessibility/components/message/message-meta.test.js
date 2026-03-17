import '@testing-library/jest-dom';
import { renderMessageMetaDataComponent } from '../../../render';
const { axe, toHaveNoViolations } = require('jest-axe');
const messages = require('../../../inbound-messages.json');

expect.extend(toHaveNoViolations);

describe('MessageMetaData component', () => {

  test('renders MessageMetaData component with no accessibility violations', async () => {
    const { container } = renderMessageMetaDataComponent(messages[0]);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
