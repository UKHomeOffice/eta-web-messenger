import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import CookieUpdateConfirmation from '../../../src/components/cookies/cookie-update-confirmation';

describe('CookieUpdateConfirmation', () => {
  test('renders the notification banner with success title', () => {
    render(
      <MemoryRouter>
        <CookieUpdateConfirmation />
      </MemoryRouter>
    );
    expect(screen.getByRole('alert')).toHaveClass('govuk-notification-banner--success');
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  test('renders the correct heading message', () => {
    render(
      <MemoryRouter>
        <CookieUpdateConfirmation />
      </MemoryRouter>
    );
    expect(screen.getByTestId('update-cookie-success-message')).toBeInTheDocument();
  });

  test('renders the link with correct href and text', () => {
    render(
      <MemoryRouter>
        <CookieUpdateConfirmation />
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: /Go back to the page you were looking at/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
    expect(link).toHaveClass('govuk-notification-banner__link');
  });

  test('sets aria-labelledby and data-module attributes', () => {
    render(
      <MemoryRouter>
        <CookieUpdateConfirmation />
      </MemoryRouter>
    );
    const banner = screen.getByRole('alert');
    expect(banner).toHaveAttribute('aria-labelledby', 'govuk-notification-banner-title');
    expect(banner).toHaveAttribute('data-module', 'govuk-notification-banner');
  });
});
