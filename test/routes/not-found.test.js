import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { axe, toHaveNoViolations } from 'jest-axe';
import NotFound from '../../src/routes/not-found';

expect.extend(toHaveNoViolations);

describe('Not found page', () => {
  test('renders not found page with correct content', () => {
    render(
      <MemoryRouter>
        <NotFound/>
      </MemoryRouter>
    );

    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(3);   
    
    expect(headings[0]).toHaveTextContent('Page not found');
    expect(headings[1]).toHaveTextContent('What you can do');
    expect(headings[2]).toHaveTextContent('Need help outside of working hours?');

    const subTextOne = screen.getByText(/We could not/i);
    expect(subTextOne).toHaveTextContent('We could not find the page you were looking for.');

    const subTextTwo = screen.getByText(/This might/i);
    expect(subTextTwo).toHaveTextContent('This might be because:');

    const reasonList = screen.getByTestId('not-found-reasons');
    expect(reasonList).toBeInTheDocument();
    expect(reasonList).toHaveTextContent('you typed the web address incorrectly');
    expect(reasonList).toHaveTextContent('the page has been moved or no longer exists');

    const checkText = screen.getByText(/Check the web/i);
    expect(checkText).toHaveTextContent("Check the web address to make sure it's correct.");

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);

    expect(screen.getByTestId('eta-not-found-link')).toBeInTheDocument();
    expect(screen.getByTestId('eta-not-found-link')).toHaveTextContent('https://www.ask-question-about-electronic-travel-authorisation.homeoffice.gov.uk');
    
    expect(screen.getByTestId('evisa-not-found-link')).toBeInTheDocument();
    expect(screen.getByTestId('evisa-not-found-link')).toHaveTextContent('https://www.ask-about-getting-access-evisa.homeoffice.gov.uk/start');
    
    expect(screen.getByTestId('euss-not-found-link')).toBeInTheDocument();
    expect(screen.getByTestId('euss-not-found-link')).toHaveTextContent('https://eu-settled-status-enquiries.service.gov.uk/start');
  });
});

describe('TypingIndicator accessibility test', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <NotFound/>
      </MemoryRouter>
    );
    const actual = await axe(container);
    expect(actual).toHaveNoViolations();
  });

});
