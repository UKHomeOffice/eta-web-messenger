import { useEffect } from 'react';
import Header from './header/header';
import PhaseBanner from './banner/phase-banner';
import Footer from './footer/footer';
import CookieBanner from '../cookies/cookie-banner';
import { CookieBannerVisibilityProvider } from '../cookies/cookie-banner-visibility-provider';
import { initialiseGoogleTagManager } from '../../google-analytics/google-analytics';
import { getEnvValueByKey } from '../../env-bootstrap';
import config from '../../../config';

export default function RootLayout({ children }) {

  // Enable analytics if feature flag is set to true. This will only be set in production.
  if (getEnvValueByKey('ENABLE_ANALYTICS') === true) {
    initialiseGoogleTagManager(getEnvValueByKey('GOOGLE_TAG_MANAGER_ID'), config.service.cookiePolicy);
  }

  useEffect(() => {
    /*
     * Apply the standard govuk-template body class to the body element.
     * It's required to be done here because the govuk SASS is loaded after the
     * initial render, so we need to apply the class dynamically. 
     */
    document.body.classList.add('govuk-template__body');
  });

  return (
    <CookieBannerVisibilityProvider>
      <CookieBanner />
      <Header />
      <div className="govuk-width-container">
        <PhaseBanner />
        {children}
      </div>
      <Footer />
    </CookieBannerVisibilityProvider>
  );
};
