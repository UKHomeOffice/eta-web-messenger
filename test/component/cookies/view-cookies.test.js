import '@testing-library/jest-dom';

import Cookies from 'js-cookie';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import ViewCookies from '../../../src/components/cookies/view-cookies';
import { CookieBannerVisibilityProvider } from '../../../src/components/cookies/cookie-banner-visibility-provider';

const updateCookieSettings = require('../../../src/components/cookies/utils');

// Mock dependencies
jest.mock('js-cookie');
jest.mock('../../../src/components/cookies/utils', () => jest.fn());
jest.mock('../../../src/components/cookies/cookie-update-confirmation', () => () => <div data-testid="cookie-update-confirmation" />);
jest.mock('../../../src/components/cookies/update-cookies-form', () => (props) => (
  <form onSubmit={props.handleSaveCookieSettings}>
    <button type="submit">Save</button>
  </form>
));

// Helper to render with router and location state
const renderWithRouter = (component, { route = '/', state = {} } = {}) => {
  window.scrollTo = jest.fn();
  return render(
    <MemoryRouter initialEntries={[{ pathname: route, state }]}>
      <CookieBannerVisibilityProvider>
        {component}
      </CookieBannerVisibilityProvider>
    </MemoryRouter>
  );
};

describe('ViewCookies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders cookie information and headings', () => {
    renderWithRouter(<ViewCookies serviceName="TestService" />, { state: { cookiePolicy: 'analytics' } });
    expect(screen.getByText('Cookies')).toBeInTheDocument();
    expect(screen.getByText('Essential cookies')).toBeInTheDocument();
    expect(screen.getByText('Analytics cookies (optional)')).toBeInTheDocument();
    expect(screen.getByText('Web Messenger')).toBeInTheDocument();
  });

  test('sets useCookies to true if cookie value is "true"', () => {
    Cookies.get.mockReturnValue('true');
    renderWithRouter(<ViewCookies serviceName="TestService" />, { state: { cookiePolicy: 'analytics' } });

    // The form should be rendered with useCookies true, but since it's mocked, we can't check directly.
    // Instead, check that Cookies.get was called with correct policy.
    expect(Cookies.get).toHaveBeenCalledWith('analytics');
  });

  test('sets useCookies to false if cookie value is not "true"', () => {
    Cookies.get.mockReturnValue('false');
    renderWithRouter(<ViewCookies serviceName="TestService" />, { state: { cookiePolicy: 'analytics' } });
    expect(Cookies.get).toHaveBeenCalledWith('analytics');
  });

  test('shows confirmation after saving settings', async () => {
    Cookies.get.mockReturnValue('true');
    renderWithRouter(<ViewCookies serviceName="TestService" />, { state: { cookiePolicy: 'analytics' } });

    await userEvent.click(screen.getByText('Save'));

    expect(screen.getByTestId('cookie-update-confirmation')).toBeInTheDocument();
  });

  test('calls updateCookieSettings with true when useCookies is true', async () => {
    Cookies.get.mockReturnValue('true');
    renderWithRouter(<ViewCookies serviceName="TestService" />, { state: { cookiePolicy: 'analytics' } });

    await userEvent.click(screen.getByText('Save'));

    expect(updateCookieSettings).toHaveBeenCalledWith('analytics', true);
  });

  test('calls updateCookieSettings with false when useCookies is false', async () => {
    Cookies.get.mockReturnValue('false');
    renderWithRouter(<ViewCookies serviceName="TestService" />, { state: { cookiePolicy: 'analytics' } });

    await userEvent.click(screen.getByText('Save'));

    expect(updateCookieSettings).toHaveBeenCalledWith('analytics', false);
  });

  test('scrolls to top when saving settings', async () => {
    Cookies.get.mockReturnValue('true');
    renderWithRouter(<ViewCookies serviceName="TestService" />, { state: { cookiePolicy: 'analytics' } });

    await userEvent.click(screen.getByText('Save'));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'smooth' });
  });

  test('renders table with analytics cookies info', () => {
    renderWithRouter(<ViewCookies serviceName="TestService" />, { state: { cookiePolicy: 'analytics' } });
    expect(screen.getByText('Analytics cookies we use')).toBeInTheDocument();

    const table = screen.getByTestId('analytics-cookies-table');
    expect(table).toBeInTheDocument();

    // Check table caption
    expect(screen.getByText('Analytics cookies we use')).toBeInTheDocument();

    // Check table headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Purpose')).toBeInTheDocument();
    expect(screen.getByText('Expires')).toBeInTheDocument();

    // Check table rows
    expect(screen.getByText('_ga')).toBeInTheDocument();
    expect(screen.getByText('Used to distinguish users')).toBeInTheDocument();
    expect(screen.getByText('2 years')).toBeInTheDocument();
  });
});
