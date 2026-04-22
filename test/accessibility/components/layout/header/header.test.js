import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Header from '../../../../../src/components/layout/header/header';

const { axe, toHaveNoViolations } = require('jest-axe');
expect.extend(toHaveNoViolations);

describe('Header component', () => {

  test('renders Header component with no accessibility violations', async () => {
    const { container } = render(<Header />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
