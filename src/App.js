import { Routes, Route, Navigate } from 'react-router';
import config from '../config';
import Eta from './routes/eta';
import ViewCookies from './components/cookies/view-cookies';
import AccessibilityStatement from './components/accessibility/statement';
import NotFound from './routes/not-found';
import EndChatConfirmation from './components/chat/end-chat-confirmation';
import { ErrorBoundary } from './error/error-boundary';

export function App() {

  let contactFormLink = config.eta.errorContactLink;

  return (
    <ErrorBoundary contactFormLink={contactFormLink}>
      <Routes>
        <Route path="/" element={<Navigate to="/eta" />} />
        <Route path="/eta" element={<Eta />} />
        <Route path="/eta/cookies" element={<ViewCookies serviceName="eta" />} />
        <Route path="/eta/accessibility" element={
          <AccessibilityStatement
            serviceName={config.eta.serviceName}
            definition={config.eta.definition} />}
        />
        <Route path="/end-chat-confirmation" element={<EndChatConfirmation/>} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}
