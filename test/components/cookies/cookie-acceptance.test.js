import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import CookieAcceptance from '../../../src/components/cookies/cookie-acceptance';

describe('CookieAcceptance', () => {
  const defaultProps = {
    accepted: true,
    hideCookieMessage: jest.fn()
  };

  test('renders accepted message when accepted is true', () => {
    render(
      <BrowserRouter>
        <CookieAcceptance {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText(/You've accepted additional cookies/i)).toBeInTheDocument();
  });

  test('renders rejected message when accepted is false', () => {
    render(
      <BrowserRouter>
        <CookieAcceptance {...defaultProps} accepted={false} />
      </BrowserRouter>
    );
    expect(screen.getByText(/You've rejected additional cookies/i)).toBeInTheDocument();
  });

  test('renders link to change cookie settings', () => {
    render(
      <BrowserRouter>
        <CookieAcceptance {...defaultProps} />
      </BrowserRouter>
    );
    const link = screen.getByTestId('change-cookie-settings');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/cookies');
  });

  test('calls hideCookieMessage when hide button is clicked', () => {
    render(
      <BrowserRouter>
        <CookieAcceptance {...defaultProps} />
      </BrowserRouter>
    );
    const button = screen.getByRole('button', { name: /Hide this message/i });
    fireEvent.click(button);
    expect(defaultProps.hideCookieMessage).toHaveBeenCalled();
  });

  test('sets correct id attributes based on serviceName', () => {
    render(
      <BrowserRouter>
        <CookieAcceptance {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByRole('alert')).toHaveAttribute('id', 'cookies-accept-message');
    expect(screen.getByRole('button')).toHaveAttribute('id', 'hide-accept-message');
  });
});
