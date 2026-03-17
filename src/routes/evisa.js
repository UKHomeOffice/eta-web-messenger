import GenesysChatComponent from '../components/genesys-chat-component';
import config from '../../config';

export default function Evisa() {
  return (
    <GenesysChatComponent
      deploymentId={config.evisa.deploymentId}
      localStorageKey={config.evisa.localStorageKey}
      serviceName={config.evisa.serviceName}
      serviceSubText={config.evisa.serviceSubText}
      errorContactLink={config.evisa.errorContactLink}
    />
  );
}

