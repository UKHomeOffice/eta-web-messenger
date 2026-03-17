import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { loadEnvironmentConfig } from './env-bootstrap';
import { ConversationProvider } from './conversation/conversation-provider';
import './styles/styles.scss';

/**
 * Load the environment config first to support running the app
 * statically (once built with parcel). This ensures a consistent
 * approach to loading environment variables whether running locally
 * or in production.
 */
loadEnvironmentConfig(() => {
  const path = window.location.pathname.toLowerCase();

  let supportType = 'ETA';

  if (path.includes('euss')) {
    supportType = 'EUSS';
  } else if (path.includes('evisa')) {
    supportType = 'eVisa';
  }

  document.title = `Webchat: UK ${supportType} support - GOV.UK`;

  const RootLayout = require('./components/layout/layout').default;
  const { App } = require('./App');
  const container = document.getElementById('app');
  const root = createRoot(container);
  root.render(
    <ConversationProvider>
      <BrowserRouter>
        <RootLayout>
          <App path={path} />
        </RootLayout>
      </BrowserRouter>
    </ConversationProvider>
  );
});
