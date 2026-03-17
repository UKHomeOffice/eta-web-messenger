import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import CookieBannerWrapper from '../../../src/components/cookies/cookie-banner-wrapper';
import { useCookieBannerVisibility } from '../../../src/components/cookies/cookie-banner-visibility-provider';

// Mock the useCookieBannerVisibility hook
jest.mock('../../../src/components/cookies/cookie-banner-visibility-provider', () => ({
  useCookieBannerVisibility: jest.fn(),
}));

// Mock the CookieBanner component
jest.mock('../../../src/components/cookies/cookie-banner', () => () => <div data-testid="cookie-banner">Cookie Banner</div>);

describe('CookieBannerWrapper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders CookieBanner when showCookieBanner is true', () => {
    useCookieBannerVisibility.mockReturnValue({ showCookieBanner: true });
    render(<CookieBannerWrapper />);
    expect(screen.getByTestId('cookie-banner')).toBeInTheDocument();
  });

  test('does not render CookieBanner when showCookieBanner is false', () => {
    useCookieBannerVisibility.mockReturnValue({ showCookieBanner: false });
    render(<CookieBannerWrapper />);
    expect(screen.queryByTestId('cookie-banner')).toBeNull();
  });

  test('does not render CookieBanner when showCookieBanner is undefined', () => {
    useCookieBannerVisibility.mockReturnValue({});
    render(<CookieBannerWrapper />);
    expect(screen.queryByTestId('cookie-banner')).toBeNull();
  });
});
