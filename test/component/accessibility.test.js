import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import AccessibilityStatement from '../../src/components/accessibility/statement';

const renderComponentWithRouter = (component) => render(
  <MemoryRouter>
    {component}
  </MemoryRouter>
);

describe('Accessibility page', () => {
  test('renders Accessibility page with correct content', () => {
    renderComponentWithRouter(<AccessibilityStatement serviceName="ETA" definition="electronic travel authorisation" />);

    const headings = screen.getAllByRole('heading');
    expect(headings[0]).toHaveTextContent('Accessibility statement for ask about electronic travel authorisation (ETA)');
    expect(headings[1]).toHaveTextContent('Reporting accessibility problems with this service');
    expect(headings[2]).toHaveTextContent('Enforcement procedure');
    expect(headings[3]).toHaveTextContent('Technical information about this service accessibility');
    expect(headings[4]).toHaveTextContent('Compliance status');
    expect(headings[5]).toHaveTextContent('Disproportionate burden');
    expect(headings[6]).toHaveTextContent("Content that's not within the scope of the accessibility regulations");
    expect(headings[7]).toHaveTextContent('Preparation of this accessibility statement');

    const subText = screen.getByText(/The Equality and Human Rights/i);
    expect(subText).toHaveTextContent("The Equality and Human Rights Commission (EHRC) is responsible for enforcing the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 (the 'accessibility regulations'). If you're not happy with how we respond to your complaint, contact the Equality Advisory and Support Service (EASS).");
  });
});
