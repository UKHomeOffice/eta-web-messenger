import Cookies from 'js-cookie';

export default function updateCookieSettings(cookiePolicy, accepted) {
  Cookies.set(cookiePolicy, accepted, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
  });
}
