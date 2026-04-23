export default function ReportingSection() {
  return (
    <>
      <h2 className="govuk-heading-m">
        Reporting accessibility problems with this service
      </h2>
      <p className="govuk-body">
        We are always looking to improve the accessibility of this service.
        If you find any problems not listed on this page or think
        we're not meeting accessibility requirements,
        contact us at <a href="mailto:hof-accessibility@digital.homeoffice.gov.uk" className="govuk-link">
          hof-accessibility@digital.homeoffice.gov.uk.
        </a>
      </p>

      <p className="govuk-body">
        <a href="https://www.w3.org/WAI/teach-advocate/contact-inaccessible-websites/" className="govuk-link">
          Read tips on contacting organisations about inaccessible websites.
        </a>
      </p>
    </>
  );
}
