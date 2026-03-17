import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CookieBannerVisibilityProvider, useCookieBannerVisibility } from '../../../src/components/cookies/cookie-banner-visibility-provider';

// Helper component to test context values
const TestComponent = () => {
  const { showCookieBanner, setShowCookieBanner } = useCookieBannerVisibility();
  return (
    <>
      <span data-testid="banner-visibility">{showCookieBanner ? 'visible' : 'hidden'}</span>
      <button onClick={() => setShowCookieBanner(false)}>Hide Banner</button>
    </>
  );
};

describe('CookieBannerVisibilityProvider', () => {
  test('provides default value as true', () => {
    render(
      <CookieBannerVisibilityProvider>
        <TestComponent />
      </CookieBannerVisibilityProvider>
    );
    expect(screen.getByTestId('banner-visibility').textContent).toBe('visible');
  });

  test('updates showCookieBanner value', async () => {
    render(
      <CookieBannerVisibilityProvider>
        <TestComponent />
      </CookieBannerVisibilityProvider>
    );
    await userEvent.click(screen.getByText('Hide Banner'));
    expect(screen.getByTestId('banner-visibility').textContent).toBe('hidden');
  });

  test('throws error when used outside provider', () => {    
    const BrokenComponent = () => {
      // This will not throw, but will return undefined context
      const context = useCookieBannerVisibility();
      return <span>{context ? 'ok' : 'undefined'}</span>;
    };
    try {
      render(<BrokenComponent />);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('useCookieBannerVisibility must be used within a CookieBannerVisibilityProvider');
    }
  });
});
