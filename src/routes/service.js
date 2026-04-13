import GenesysChatComponent from '../components/genesys-chat-component';
import config from '../../config';

export default function Service() {
  return (
    <GenesysChatComponent
      deploymentId={config.service.deploymentId}
      localStorageKey={config.service.localStorageKey}
      serviceName={config.service.name}
      serviceSubText={config.service.subText}
      errorContactLink={config.service.errorContactLink}
    />
  );
}
