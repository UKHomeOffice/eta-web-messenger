import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Footer from '../../../../src/components/layout/footer/footer';

describe('Footer component', () => {

  test('renders with Cookies link for correct service', async () => {
    render(
      <MemoryRouter>
        <Footer serviceName="ETA" cookiePolicy="eta_policy" />
      </MemoryRouter>
    );

    const cookiesLink = document.querySelector('[data-testid="footer-cookies-link"]');
    expect(cookiesLink).toBeInTheDocument();
    expect(cookiesLink).toHaveAttribute('href', '/cookies');
  });

  test('renders with Privacy policy link', async () => {
    render(
      <MemoryRouter>
        <Footer serviceName="ETA" cookiePolicy="eta_policy" />
      </MemoryRouter>
    );

    const privacyLink = document.querySelector('[data-testid="footer-privacy-policy-link"]');
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute('href', 'https://www.gov.uk/government/publications/personal-information-use-in-borders-immigration-and-citizenship/borders-immigration-and-citizenship-privacy-information-notice');
  });

  test('renders with Accessibility statement link', async () => {
    render(
      <MemoryRouter>
        <Footer serviceName="ETA" cookiePolicy="eta_accessibilty_statement" />
      </MemoryRouter>
    );

    const accessibilityLink = document.querySelector('[data-testid="footer-accessibilty-statement-link"]');
    expect(accessibilityLink).toBeInTheDocument();
    expect(accessibilityLink).toHaveAttribute('href', '/accessibility');
  });
});
