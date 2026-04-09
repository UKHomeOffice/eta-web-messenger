import { Routes, Route, Navigate } from 'react-router';
import config from '../config';
import Service from './routes/service';
import ViewCookies from './components/cookies/view-cookies';
import AccessibilityStatement from './components/accessibility/statement';
import NotFound from './routes/not-found';
import EndChatConfirmation from './components/chat/end-chat-confirmation';
import { ErrorBoundary } from './error/error-boundary';

export function App() {

  let contactFormLink = config.service.errorContactLink;
  const serviceSlug = config.service.serviceName.toLowerCase();
  const basePath = `/${serviceSlug}`; // e.g. /eta

  return (
    <ErrorBoundary contactFormLink={contactFormLink}>
      <Routes>
        <Route path="/" element={<Navigate to={basePath} />} />
        <Route path={basePath} element={<Service />} />
        <Route path={`${basePath}/cookies`} element={<ViewCookies serviceName={serviceSlug} />} />
        <Route path={`${basePath}/accessibility`} element={
          <AccessibilityStatement
            serviceName={config.service.serviceName}
            definition={config.service.definition} />}
        />
        <Route path="/end-chat-confirmation" element={<EndChatConfirmation/>} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}
