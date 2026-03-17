import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UpdateCookiesForm from '../../../src/components/cookies/update-cookies-form';
import { CookieBannerVisibilityProvider } from '../../../src/components/cookies/cookie-banner-visibility-provider';

const renderWithProvider = (component) => {  
  return render(
    <CookieBannerVisibilityProvider>
      {component}
    </CookieBannerVisibilityProvider>
  );
};

describe('UpdateCookiesForm', () => {
  const serviceName = 'test-service';
  let setUseCookies;
  let handleSaveCookieSettings;

  beforeEach(() => {
    setUseCookies = jest.fn();
    handleSaveCookieSettings = jest.fn();
  });

  test('renders radio buttons with correct labels', () => {
    const { getByLabelText } = renderWithProvider(
      <UpdateCookiesForm
        serviceName={serviceName}
        useCookies={true}
        setUseCookies={setUseCookies}
        handleSaveCookieSettings={handleSaveCookieSettings}
      />
    );
    expect(getByLabelText('Use cookies that measure my website use.')).toBeInTheDocument();
    expect(getByLabelText('Do not use cookies that measure my website use.')).toBeInTheDocument();
  });

  test('accept radio is checked when useCookies is true', () => {
    const { getByLabelText } = renderWithProvider(
      <UpdateCookiesForm
        serviceName={serviceName}
        useCookies={true}
        setUseCookies={setUseCookies}
        handleSaveCookieSettings={handleSaveCookieSettings}
      />
    );
    expect(getByLabelText('Use cookies that measure my website use.').checked).toBe(true);
    expect(getByLabelText('Do not use cookies that measure my website use.').checked).toBe(false);
  });

  test('reject radio is checked when useCookies is false', () => {
    const { getByLabelText } = renderWithProvider(
      <UpdateCookiesForm
        serviceName={serviceName}
        useCookies={false}
        setUseCookies={setUseCookies}
        handleSaveCookieSettings={handleSaveCookieSettings}
      />
    );
    expect(getByLabelText('Use cookies that measure my website use.').checked).toBe(false);
    expect(getByLabelText('Do not use cookies that measure my website use.').checked).toBe(true);
  });

  test('calls setUseCookies(true) when accept radio is clicked', async () => {
    const { getByLabelText } = renderWithProvider(
      <UpdateCookiesForm
        serviceName={serviceName}
        useCookies={false}
        setUseCookies={setUseCookies}
        handleSaveCookieSettings={handleSaveCookieSettings}
      />
    );
    await userEvent.click(getByLabelText('Use cookies that measure my website use.'));
    expect(setUseCookies).toHaveBeenCalledWith(true);
  });

  test('calls setUseCookies(false) when reject radio is clicked', async  () => {
    const { getByLabelText } = renderWithProvider(
      <UpdateCookiesForm
        serviceName={serviceName}
        useCookies={true}
        setUseCookies={setUseCookies}
        handleSaveCookieSettings={handleSaveCookieSettings}
      />
    );
    await userEvent.click(getByLabelText('Do not use cookies that measure my website use.'));
    expect(setUseCookies).toHaveBeenCalledWith(false);
  });

  test('calls handleSaveCookieSettings when save button is clicked', async () => {
    const { getByText } = renderWithProvider(
      <UpdateCookiesForm
        serviceName={serviceName}
        useCookies={true}
        setUseCookies={setUseCookies}
        handleSaveCookieSettings={handleSaveCookieSettings}
      />
    );
    await userEvent.click(getByText('Save cookie settings'));
    expect(handleSaveCookieSettings).toHaveBeenCalled();
  });
});
