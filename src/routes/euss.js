import GenesysChatComponent from '../components/genesys-chat-component';
import config from '../../config';

export default function Euss() {
  return (
    <GenesysChatComponent
      deploymentId={config.euss.deploymentId}
      localStorageKey={config.euss.localStorageKey}
      serviceName={config.euss.serviceName}
      serviceSubText={config.euss.serviceSubText}
      errorContactLink={config.euss.errorContactLink}
    />
  );
}

