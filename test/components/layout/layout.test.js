import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import Layout from '../../../../src/components/layout/layout';

const { axe, toHaveNoViolations } = require('jest-axe');
expect.extend(toHaveNoViolations);

describe('Layout component', () => {

  test('renders Layout component with no accessibility violations', async () => {
    const { container } = render(
      <BrowserRouter>
        <Layout children={<h1>Testing</h1>} />
      </BrowserRouter>
    );
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
