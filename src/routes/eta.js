import GenesysChatComponent from '../components/genesys-chat-component';
import config from '../../config';

export default function Eta() {
  return (
    <GenesysChatComponent
      deploymentId={config.eta.deploymentId}
      localStorageKey={config.eta.localStorageKey}
      serviceName={config.eta.serviceName}
      serviceSubText={config.eta.serviceSubText}
      errorContactLink={config.eta.errorContactLink}
    />
  );
}
