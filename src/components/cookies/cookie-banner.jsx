import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import Cookies from 'js-cookie';
import CookieAcceptance from './cookie-acceptance';
import updateCookieSettings from './utils';
import { useCookieBannerVisibility } from './cookie-banner-visibility-provider';
import config from '../../../config';

export default function CookieBanner() {

  const { showCookieBanner, setShowCookieBanner } = useCookieBannerVisibility();

  const [cookiesAccepted, setCookiesAccepted] = useState(null);
  const [showCookieAcceptanceMessage, setShowCookieAcceptanceMessage] = useState(false);

  const cookiePolicy = config.service.cookiePolicy;

  useEffect(() => {
    const cookie = Cookies.get(cookiePolicy);
    if (cookie) {
      setShowCookieBanner(false);
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }

  }, [showCookieBanner]);

  const setCookiePolicy = (accepted) => {
    setShowCookieBanner(false);
    updateCookieSettings(cookiePolicy, accepted);
    if (accepted) {
      setCookiesAccepted(true);
    } else {
      setCookiesAccepted(false);
    }
    setShowCookieAcceptanceMessage(true);
  };

  const hideCookieAcceptanceMessage = () => {
    setShowCookieAcceptanceMessage(false);
  };

  return (
    <>
      {showCookieBanner &&
        <div className="govuk-cookie-banner" 
          data-nosnippet 
          id="main-cookie-banner" 
          aria-label="Cookies on UK Visas and Immigration services"
        >
          <div className="govuk-cookie-banner__message govuk-width-container" id="main-cookie-message">
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-two-thirds">
                <h2 className="govuk-cookie-banner__heading govuk-heading-m">
                  Cookies on UK Visas and Immigration services
                </h2>
                <div className="govuk-cookie-banner__content">
                  <p className="govuk-body">We use some essential cookies to make this service work.</p>
                  <p className="govuk-body">
                    We'd also like to use additional cookies so we can 
                    understand how you use the service and make improvements.
                  </p>
                </div>
              </div>
            </div>
            <div className="govuk-button-group">
              <button 
                type="button" 
                className="govuk-button" 
                data-module="govuk-button" 
                id="cookies-accept" 
                onClick={() => setCookiePolicy(true)}
              >
                Accept analytics cookies
              </button>
              <button 
                type="button" 
                className="govuk-button" 
                data-module="govuk-button" 
                id="cookies-reject" 
                onClick={() => setCookiePolicy(false)}
              >
                Reject analytics cookies
              </button>
              <Link 
                className="govuk-link view-cookie-link" 
                to="/cookies"
              >
                View cookies
              </Link>
            </div>
          </div>
        </div>
      }
      {showCookieAcceptanceMessage &&
        <CookieAcceptance
          accepted={cookiesAccepted}
          hideCookieMessage={hideCookieAcceptanceMessage}
          cookiePolicy={cookiePolicy}
        />
      }
    </>
  );
}
