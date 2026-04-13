import config from '../../../config';

export default function PreparationStatementSection() {
  return (
    <div>
      <h2 className="govuk-heading-m">
        Preparation of this accessibility statement
      </h2>

      <p className="govuk-body">
        This statement was prepared on {config.accessibility.statementDate}.
        It was last reviewed on {config.accessibility.statementReviewedDate}.
      </p>

      <p className="govuk-body">
        This service was last tested on {config.accessibility.websiteUpdates}.
        The test was carried out internally by the Home Office.
      </p>

      <p className="govuk-body">
        We tested the service based on a user's ability to complete key journeys.
        All parts of the chosen journeys were tested, including documents. Journeys were chosen on a number of factors
        including usage statistics, risk assessments and subject matter.
      </p>
    </div>
  );
}
