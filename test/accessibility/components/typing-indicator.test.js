import { axe, toHaveNoViolations } from 'jest-axe';
import { renderTypingComponent } from '../../render';
import '@testing-library/jest-dom';

expect.extend(toHaveNoViolations);

describe('TypingIndicator accessibility test', () => {
  it('should not display accessibility violations when visible', async () => {
    const { container } = renderTypingComponent('Chris', true);
    const actual = await axe(container);
    expect(actual).toHaveNoViolations();
  });

  it('should not display accessibility violations when hidden', async () => {
    const { container } = renderTypingComponent('Chris', false);
    const actual = await axe(container);
    expect(actual).toHaveNoViolations();
  });
});
