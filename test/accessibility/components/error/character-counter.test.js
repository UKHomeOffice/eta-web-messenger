import { axe, toHaveNoViolations } from 'jest-axe';
import { renderCharacterCouterComponent } from '../../../render';
import '@testing-library/jest-dom';

expect.extend(toHaveNoViolations);

describe('CharacterCounter accessibility test', () => {
  it('should not display accessibility violations when character is not over limit', async () => {
    const { container } = renderCharacterCouterComponent(50);
    const actual = await axe(container);
    expect(actual).toHaveNoViolations();
  });

  it('should not display accessibility violations when character is over limit', async () => {
    const { container } = renderCharacterCouterComponent(5000);
    const actual = await axe(container);
    expect(actual).toHaveNoViolations();
  });
});
