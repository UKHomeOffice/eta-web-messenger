import { Routes, Route, Navigate } from 'react-router';
import config from '../config';
import Eta from './routes/eta';
import Euss from './routes/euss';
import Evisa from './routes/evisa';
import ViewCookies from './components/cookies/view-cookies';
import AccessibilityStatement from './components/accessibility/statement';
import NotFound from './routes/not-found';
import EndChatConfirmation from './components/chat/end-chat-confirmation';
import { ErrorBoundary } from './error/error-boundary';

export function App({path}) {

  let contactFormLink = config.eta.errorContactLink;
  if (path.includes('euss')) {
    contactFormLink = config.euss.errorContactLink;
  } else if (path.includes('evisa')) {
    contactFormLink = config.evisa.errorContactLink;
  }

  return (
    <ErrorBoundary contactFormLink={contactFormLink}>
      <Routes>
        <Route path="/" element={<Navigate to="/eta" />} />
        <Route path="/eta" element={<Eta />} />
        <Route path="/euss" element={<Euss />} />
        <Route path="/evisa" element={<Evisa />} />
        <Route path="/eta/cookies" element={<ViewCookies serviceName="eta" />} />
        <Route path="/euss/cookies" element={<ViewCookies serviceName="euss" />} />
        <Route path="/evisa/cookies" element={<ViewCookies serviceName="evisa" />} />
        <Route path="/eta/accessibility" element={
          <AccessibilityStatement
            serviceName={config.eta.serviceName}
            definition={config.eta.definition} />}
        />
        <Route path="/euss/accessibility" element={
          <AccessibilityStatement
            serviceName={config.euss.serviceName}
            definition={config.euss.definition} />}
        />
        <Route path="/evisa/accessibility" element={
          <AccessibilityStatement
            serviceName={config.evisa.serviceName}
            definition={config.evisa.definition} />}
        />
        <Route path="/end-chat-confirmation" element={<EndChatConfirmation/>} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}
