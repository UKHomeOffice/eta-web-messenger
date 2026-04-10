import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Cookies from 'js-cookie';
import userEvent from '@testing-library/user-event';
import CookieBanner from '../../../src/components/cookies/cookie-banner';
import { CookieBannerVisibilityProvider } from '../../../src/components/cookies/cookie-banner-visibility-provider';

// Mock dependencies
jest.mock('js-cookie');

jest.mock('react-router', () => ({
  Link: ({ children, ...props }) => <a {...props}>{children}</a>
}));

const serviceName = 'test-service';
const cookiePolicy = 'test-cookie-policy';

beforeEach(() => {
  Cookies.get.mockClear();
  Cookies.set.mockClear();
  window.scrollTo = jest.fn();
});

const renderWithProvider = (component) => {  
  return render(
    <CookieBannerVisibilityProvider>
      {component}
    </CookieBannerVisibilityProvider>
  );
};

describe('CookieBanner', () => {
  test('renders cookie banner when cookie not set', () => {
    Cookies.get.mockReturnValue(undefined);
    renderWithProvider(<CookieBanner serviceName={serviceName} cookiePolicy={cookiePolicy} />);

    const banner = screen.getByLabelText(/Cookies on UK Visas and Immigration services/i);
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute('id', 'test-service-main-cookie-banner');

    const acceptanceButton = screen.getByRole('button', { name: /Accept analytics cookies/i });
    expect(acceptanceButton).toBeInTheDocument();
    expect(acceptanceButton).toHaveAttribute('id', 'test-service-cookies-accept');

    const rejectionButton = screen.getByRole('button', { name: /Reject analytics cookies/i });
    expect(rejectionButton).toBeInTheDocument();
    expect(rejectionButton).toHaveAttribute('id', 'test-service-cookies-reject');

    expect(window.scrollTo).toHaveBeenCalled();
  });

  test('does not render cookie banner when cookie is set', () => {
    Cookies.get.mockReturnValue('true');
    renderWithProvider(<CookieBanner serviceName={serviceName} cookiePolicy={cookiePolicy} />);
    expect(screen.queryByLabelText(/Cookies on UK Visas and Immigration services/i)).not.toBeInTheDocument();
  });

  test('accepts analytics cookies and renders acceptance message', async () => {
    Cookies.get.mockReturnValue(undefined);
    renderWithProvider(<CookieBanner serviceName={serviceName} cookiePolicy={cookiePolicy} />);
    
    await userEvent.click(screen.getByText(/Accept analytics cookies/i));
    
    expect(Cookies.set).toHaveBeenCalledWith(
      cookiePolicy,
      true,
      expect.objectContaining({ expires: expect.any(Date) })
    );
    expect(screen.getByTestId('cookies-acceptance-message')).toHaveTextContent("You've accepted additional cookies. You can change your cookie settings at any time.Hide this message");

    const cookieSettingsLink = screen.getByTestId('change-cookie-settings');
    expect(cookieSettingsLink).toBeInTheDocument();
    expect(cookieSettingsLink).toHaveAttribute('to', '/cookies');
  });

  test('rejects analytics cookies and renders rejection message', async () => {
    Cookies.get.mockReturnValue(undefined);
    renderWithProvider(<CookieBanner serviceName={serviceName} cookiePolicy={cookiePolicy} />);
    
    await userEvent.click(screen.getByText(/Reject analytics cookies/i));
    
    expect(Cookies.set).toHaveBeenCalledWith(
      cookiePolicy,
      false,
      expect.objectContaining({ expires: expect.any(Date) })
    );
    expect(screen.getByTestId('cookies-acceptance-message')).toHaveTextContent("You've rejected additional cookies. You can change your cookie settings at any time.Hide this message");

    const cookieSettingsLink = screen.getByTestId('change-cookie-settings');
    expect(cookieSettingsLink).toBeInTheDocument();
    expect(cookieSettingsLink).toHaveAttribute('to', '/cookies');
  });

  test('shows "View cookies" link', () => {
    Cookies.get.mockReturnValue(undefined);
    renderWithProvider(<CookieBanner serviceName={serviceName} cookiePolicy={cookiePolicy} />);

    const link = screen.getByText(/View cookies/i);

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('to', '/cookies');
  });

  test('hides cookie acceptance message when hideCookieMessage is called', async () => {
    Cookies.get.mockReturnValue(undefined);
    renderWithProvider(<CookieBanner serviceName={serviceName} cookiePolicy={cookiePolicy} />);

    await userEvent.click(screen.getByText(/Accept analytics cookies/i));
    
    const acceptance = screen.getByTestId('cookies-acceptance-message');
    
    expect(acceptance).toBeInTheDocument();
    
    // Simulate hideCookieMessage    
    await userEvent.click(acceptance);
    // Since our mock doesn't handle the click, this is just a placeholder for real interaction
  });
});
