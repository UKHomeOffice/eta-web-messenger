import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { loadEnvironmentConfig } from './env-bootstrap';
import './styles/styles.scss';

/**
 * Load the environment config first to support running the app
 * statically (once built with vite). This ensures a consistent
 * approach to loading environment variables whether running locally
 * or in production.
 */
loadEnvironmentConfig(async () => {
  document.title = 'Webchat: UK ETA support - GOV.UK';

  /**
   * These components are imported dynamically to ensure they are only loaded 
   * when the environment config has been loaded, as they rely on config values.
   */
  const [{ default: RootLayout }, { App }] = await Promise.all([
    import('./components/layout/layout'),
    import('./App'),
  ])
  
  const container = document.getElementById('app');
  const root = createRoot(container);
  root.render(
    <BrowserRouter>
      <RootLayout>
        <App />
      </RootLayout>
    </BrowserRouter>
  );
});
