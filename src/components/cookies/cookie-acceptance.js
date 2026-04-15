import { Link } from 'react-router';

export default function CookieAcceptance({ accepted, hideCookieMessage, cookiePolicy }) {
  return (
    <div className="govuk-cookie-banner__message govuk-width-container" 
      data-testid="cookies-acceptance-message" 
      id="cookies-accept-message" 
      role="alert">
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <div className="govuk-cookie-banner__content">
            <p className="govuk-body">You've {accepted ? 'accepted' : 'rejected'} additional cookies. 
              You can <Link 
              data-testid="change-cookie-settings" 
              className="govuk-link" 
              to="/cookies" 
              state={{ cookiePolicy }}>change your cookie settings</Link> at any time.</p>
          </div>
        </div>
      </div>
      <div className="govuk-button-group">
        <button 
          className="govuk-button" 
          id="hide-accept-message" 
          data-module="govuk-button" 
          onClick={hideCookieMessage}
        >
          Hide this message
        </button>
      </div>
    </div>
  );
}
