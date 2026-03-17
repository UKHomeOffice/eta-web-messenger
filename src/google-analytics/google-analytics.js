import Cookies from 'js-cookie';

/**
 * Initialise the Google Tag Manager script, which we use
 * to enable google analytics across the app. The gtmId will
 * be passed in from an environment variable. If the user opted out of
 * analytics cookies, the script will not be added to the page and if any
 * analytics cookies are present, they will be removed.
 * @param {string} gtmId 
 * @param {string} cookiePolicy - the name of the cookie that stores the user's cookie preferences
 */
export function initialiseGoogleTagManager(gtmId, cookiePolicy) {
  const cookieConsent = Cookies.get(cookiePolicy);  
  if (cookieConsent === 'true' || cookieConsent === undefined) {
    const script = document.createElement('script');
    script.id = 'gtm-script';
    script.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');
  `;
    document.head.appendChild(script);
  } else {
    const gtmScript = document.getElementById('gtm-script');
    if (gtmScript) {
      gtmScript.remove();
    }
    // Remove Google Analytics cookies if user has opted out of analytics cookies
    removeGoogleAnalyticsCookies();
  }
};

/**
 * Remove any Google Analytics cookies that may be present.
 * The only GA cookies that are stored are _ga and _ga_<container-id>.
 */
export function removeGoogleAnalyticsCookies() {
  Object.keys(Cookies.get()).forEach((cookieName) => {
    if (cookieName.startsWith('_ga')) {
      Cookies.remove(cookieName);
    }
  });
}
