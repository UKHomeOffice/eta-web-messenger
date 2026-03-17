import { createContext, useContext, useState } from 'react';

const CookieBannerVisibilityContext = createContext();

export const CookieBannerVisibilityProvider = ({ children }) => {

  const [showCookieBanner, setShowCookieBanner] = useState(true);
  return (
    <CookieBannerVisibilityContext.Provider value={{ showCookieBanner, setShowCookieBanner }}>
      {children}
    </CookieBannerVisibilityContext.Provider>
  );
};

export const useCookieBannerVisibility = () => {
  const context = useContext(CookieBannerVisibilityContext);
  if (!context) {
    throw new Error('useCookieBannerVisibility must be used within a CookieBannerVisibilityProvider');
  }
  return context;
};
