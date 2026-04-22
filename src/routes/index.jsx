import { useState } from 'react';
import { useNavigate } from 'react-router';
import { GenesysChatComponent } from 'hof-genesys-chat-component';
import LoadingSpinner from '@hods/loading-spinner';
import ErrorComponent from '../components/error/error-component';
import PageHeading from '../components/content/page-heading';
import logData from '../utils/logging';
import config from '../../config';

export default function Eta() {

  const [isErrorState, setIsErrorState] = useState(false);

  let navigate = useNavigate();

  return (
    <>
      {isErrorState && <ErrorComponent contactFormLink={config.service.errorContactLink} />}
      {!isErrorState && (
        <>
          <PageHeading serviceName={config.service.name} serviceSubText={config.service.subText} />
          <GenesysChatComponent
            genesysEnvironment={config.service.environment}
            deploymentId={config.service.deploymentId}
            serviceMetadata={{
              serviceName: config.service.name,
              agentConnectedText: config.bannerTypeDisplay.human,
              agentDisconnectedText: config.bannerTypeDisplay.agentDisconnected,
              offlineText: config.bannerTypeDisplay.offline,
              onlineText: config.bannerTypeDisplay.online,
              botMetaDisplay: config.botMetaDisplay,
            }}
            onChatEnded={() => navigate("/end-chat-confirmation")}
            loggingCallback={logData}
            loadingSpinner={<LoadingSpinner />}
            errorCallback= {() => setIsErrorState(true)}
          />
        </>
      )}
    </>
  );
}
