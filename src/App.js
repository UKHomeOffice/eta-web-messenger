import { Routes, Route } from 'react-router';
import config from '../config';
import Service from './routes/service';
import ViewCookies from './components/cookies/view-cookies';
import AccessibilityStatement from './components/accessibility/statement';
import NotFound from './routes/not-found';
import EndChatConfirmation from './components/chat/end-chat-confirmation';
import { ErrorBoundary } from './error/error-boundary';

export function App() {
  const contactFormLink = config.service.errorContactLink;

  return (
    <ErrorBoundary contactFormLink={contactFormLink}>
      <Routes>
        <Route path="/" element={<Service />} />
        <Route path="/cookies" element={<ViewCookies serviceName={config.service.name.toLowerCase()} />} />
        <Route path="/accessibility" element={
          <AccessibilityStatement
            serviceName={config.service.name}
            definition={config.service.definition}
          />}
        />
        <Route path="/end-chat-confirmation" element={<EndChatConfirmation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}
