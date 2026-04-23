import { Link } from 'react-router';

export default function CookieUpdateConfirmation() {
  return (
    <div className="govuk-notification-banner govuk-notification-banner--success" 
      role="alert" aria-labelledby="govuk-notification-banner-title" 
      data-module="govuk-notification-banner"
    >
      <div className="govuk-notification-banner__header">
        <h2 className="govuk-notification-banner__title" id="govuk-notification-banner-title">
          Success
        </h2>
      </div>
      <div className="govuk-notification-banner__content">
        <p className="govuk-notification-banner__heading" data-testid="update-cookie-success-message">
          You've set your cookie preferences. 
          <Link className="govuk-notification-banner__link" to="/">
            Go back to the page you were looking at
          </Link>.
        </p>
      </div>
    </div>
  );
}
