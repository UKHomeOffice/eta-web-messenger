const { getEnvValueByKey } = require('./src/env-bootstrap');

module.exports = {
  bannerTypeDisplay: {
    bot: 'You are speaking with a digital assistant',
    human: 'You are now talking to a live agent',
    agentDisconnected:
      'The agent has disconnected. You can continue to chat with the digital assistant or start a new chat ' +
      'by sending a message to the digital assistant.',
    offline: 'You are currently offline. Messages cannot be sent until reconnected to the internet.',
    online: 'You are now online. Messages can now be sent.'
  },
  botMetaDisplay: 'Digital assistant',
  userMetaDisplay: 'You',
  maxCharacterLimit: 4096,
  service: {
    definition: 'electronic travel authorisation',
    deploymentId: getEnvValueByKey('ETA_DEPLOYMENT_ID'),
    localStorageKey: 'eta-genesys-session',
    serviceName: 'ETA',
    serviceSubText: 'an ETA (electronic travel authorisation).',
    errorContactLink: 'https://www.ask-question-about-electronic-travel-authorisation.homeoffice.gov.uk',
    gaUtmParam: '?utm_source=webmessenger&utm_medium=internal_link&utm_campaign=ETA_Internal_WebMessenger'
  },
  statementDate: '(10 November 2025)',
  statementReviewedDate: '(10 November 2025)',
  websiteUpdates: '(30 October 2025)',
  logApiEndpoint: getEnvValueByKey('LOG_ENDPOINT'),
  feedback: {
    eta: 'https://ukhomeoffice.qualtrics.com/jfe/form/SV_396eOdMT06w04YK'
  }
};
