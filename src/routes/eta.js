import GenesysChatComponent from '../components/genesys-chat-component';
import config from '../../config';

export default function Eta() {
  return (
    <GenesysChatComponent
      deploymentId={config.service.deploymentId}
      localStorageKey={config.service.localStorageKey}
      serviceName={config.service.serviceName}
      serviceSubText={config.service.serviceSubText}
      errorContactLink={config.service.errorContactLink}
    />
  );
}
