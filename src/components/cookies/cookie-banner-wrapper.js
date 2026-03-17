import { useCookieBannerVisibility } from './cookie-banner-visibility-provider';
import CookieBanner from './cookie-banner';

export default function CookieBannerWrapper() {
  const { showCookieBanner } = useCookieBannerVisibility();

  if (!showCookieBanner) return null;

  return <CookieBanner />;
}
