import '@testing-library/jest-dom';
import { renderMessageTextComponent } from '../../../render';

const { axe, toHaveNoViolations } = require('jest-axe');
expect.extend(toHaveNoViolations);

jest.mock('../../../../utils/text-converter', () => ({
  convertHtmlWithLinkText: jest.fn()
}));

describe('MessageText component', () => {

  test('renders MessageText component with no accessibility violations', async () => {
    const { container } = renderMessageTextComponent('Testing');
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
