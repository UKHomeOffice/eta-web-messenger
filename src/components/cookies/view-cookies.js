import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import updateCookieSettings from './utils';
import CookieUpdateConfirmation from './cookie-update-confirmation';
import UpdateCookiesForm from './update-cookies-form';
import { useCookieBannerVisibility } from './cookie-banner-visibility-provider';
import { removeGoogleAnalyticsCookies } from '../../google-analytics/google-analytics';
import config from '../../../config';

export default function ViewCookies() {

  const { setShowCookieBanner } = useCookieBannerVisibility();

  const [useCookies, setUseCookies] = useState(false);
  const [hasUpdatedSettings, setHasUpdatedSettings] = useState(false);

  const cookiePolicy = config.service.cookiePolicy;

  useEffect(() => {
    const cookieValue = Cookies.get(cookiePolicy);
    if (cookieValue === 'true') {
      setUseCookies(true);
    } else {
      setUseCookies(false);
    }
  }, []);

  const handleSaveCookieSettings = (event) => {
    event.preventDefault();
    setShowCookieBanner(false);
    setHasUpdatedSettings(true);
    if (useCookies) {
      updateCookieSettings(cookiePolicy, true);
    } else {
      updateCookieSettings(cookiePolicy, false);
      // Remove Google Analytics cookies if user has opted out of analytics cookies
      removeGoogleAnalyticsCookies();
    }

    // Scroll to page top once user has saved their settings to show confirmation message
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="govuk-width-container">
      {hasUpdatedSettings &&
        <CookieUpdateConfirmation />
      }
      <main className="govuk-main-wrapper " id="main-content" role="main">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h1 className="govuk-heading-l">Cookies</h1>
            <p className="govuk-body">
              Cookies are small files saved on your phone, tablet or computer when you visit a website.
            </p>
            <p className="govuk-body">
              We use cookies to make this site work and collect information about how you use our service.
            </p>
            <h2 className="govuk-heading-m">Essential cookies</h2>
            <p className="govuk-body">
              Essential cookies keep your information secure while you use this service. 
              We do not need to ask permission to use them.
            </p>
            <h3 className="govuk-heading-s">Web Messenger</h3>
            <p className="govuk-body">We use cookies to restore chat sessions, track the chat state,
               and store your decisions. For more information about cookies see 
            <a className="govuk-link govuk-link--no-visited-state" 
              href="https://help.mypurecloud.com/articles/genesys-cloud-and-cookies/">
                  Genesys Cloud and cookies
            </a>.</p>
            <h2 className="govuk-heading-m">Analytics cookies (optional)</h2>
            <p className="govuk-body">
              We use Google Analytics to collect information about how you use this service.
              This helps us check it's meeting your needs and make improvements.
            </p>
            <p className="govuk-body">Google Analytics stores information about:</p>

            <ul className="govuk-list govuk-list--bullet">
              <li>how you got to the site</li>
              <li>pages you visit and how long you spend on them</li>
              <li>what you click on</li>
            </ul>

            <p className="govuk-body">
              No personal details are stored with this information, so you can't be identified.
            </p>
            <table className="govuk-table" data-testid="analytics-cookies-table">
              <caption className="govuk-table__caption govuk-table__caption--s">Analytics cookies we use</caption>
              <thead className="govuk-table__head">
                <tr className="govuk-table__row">
                  <th scope="col" className="govuk-table__header">Name</th>
                  <th scope="col" className="govuk-table__header">Purpose</th>
                  <th scope="col" className="govuk-table__header">Expires</th>
                </tr>
              </thead>
              <tbody className="govuk-table__body">
                <tr className="govuk-table__row">
                  <td className="govuk-table__cell">_ga</td>
                  <td className="govuk-table__cell">Used to distinguish users</td>
                  <td className="govuk-table__cell">2 years</td>
                </tr>        
              </tbody>
            </table>
            <p className="govuk-body">We do not allow Google to use or share the data about how you use this site.</p>
            <UpdateCookiesForm
              useCookies={useCookies}
              setUseCookies={setUseCookies}
              handleSaveCookieSettings={handleSaveCookieSettings}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
