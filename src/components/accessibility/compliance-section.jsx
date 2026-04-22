export default function ComplianceStatusSection() {
  return (
    <>
      <h2 className="govuk-heading-m">
        Compliance status
      </h2>

      <p className="govuk-body">
        This service is compliant with
        the <a href="https://www.w3.org/TR/WCAG22/"
          className="govuk-link">
          Web Content Accessibility Guidelines version 2.2</a> AA standard.
      </p>

      <h3 className="govuk-heading-s">
        Disproportionate burden
      </h3>
      <p className="govuk-body">
        At this time, we have not made any disproportionate burden claims.
      </p>
      <h3 className="govuk-heading-s">
        Content that's not within the scope of the accessibility regulations
      </h3>
      <p className="govuk-body">
        At this time, this service does not contain any content that is exempt from the regulations.
      </p>
    </>
  );
}
