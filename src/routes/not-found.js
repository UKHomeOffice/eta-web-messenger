export default function NotFound() {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-l">Page not found</h1>
        <p className="govuk-body">
          We could not find the page you were looking for.
        </p>
        <div>
          <p className="govuk-body">
            This might be because:
          </p> 
          <ul className="govuk-list govuk-list--bullet" data-testid="not-found-reasons">
            <li>you typed the web address incorrectly</li>
            <li>the page has been moved or no longer exists</li>
          </ul>
        </div>
        <h2 className="govuk-heading-m">What you can do</h2>
        <p className="govuk-body">
          Check the web address to make sure it's correct.
        </p>
        <h2 className="govuk-heading-m">Need help outside of working hours?</h2>
        <p className="govuk-body">
          If you need support and it's outside of normal working hours, you can use one of the following contact forms:
        </p>
        <p className="govuk-body">
          ETA:
          &nbsp;<a id="eta-not-found-link"
            data-testid="eta-not-found-link"
            className="govuk-link govuk-link--no-visited-state" 
            href="https://www.ask-question-about-electronic-travel-authorisation.homeoffice.gov.uk">
              https://www.ask-question-about-electronic-travel-authorisation.homeoffice.gov.uk</a>
        </p>
      </div>
    </div>
  );
}
