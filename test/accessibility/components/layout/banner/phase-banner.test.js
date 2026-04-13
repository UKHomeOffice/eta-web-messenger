import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import PhaseBanner from '../../../../../src/components/layout/banner/phase-banner';

const { axe, toHaveNoViolations } = require('jest-axe');
expect.extend(toHaveNoViolations);

describe('PhaseBanner component', () => {

  test('renders PhaseBanner component with no accessibility violations', async () => {
    const { container } = render(<PhaseBanner />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
