import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../../src/error/error-boundary';

function ProblemChild() {
  throw new Error('Test error');
}

describe('ErrorBoundary', () => {
  it('should render children when no error', () => {
    render(
      <ErrorBoundary contactFormLink="/contact">
        <div>Safe Child</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Safe Child')).toBeInTheDocument();
  });

  it('should catch errors and display fallback UI', () => {
    render(
      <ErrorBoundary contactFormLink="/contact">
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/Please try again in a few minutes or use our/i)).toBeInTheDocument();
    expect(screen.getByText(/contact form/i)).toBeInTheDocument();
    expect(screen.getByText(/We will reply in 3 to 5 working days/i)).toBeInTheDocument();

    const contactLink = screen.getByTestId('error-contact-form');
    expect(contactLink).toHaveAttribute('href', expect.stringContaining('/contact'));
  });
});
