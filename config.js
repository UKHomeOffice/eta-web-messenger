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
  eta: {
    definition: 'electronic travel authorisation',
    deploymentId: getEnvValueByKey('ETA_DEPLOYMENT_ID'),
    localStorageKey: 'eta-genesys-session',
    serviceName: 'ETA',
    serviceSubText: 'an ETA (electronic travel authorisation).',
    errorContactLink: 'https://www.ask-question-about-electronic-travel-authorisation.homeoffice.gov.uk',
    gaUtmParam: '?utm_source=webmessenger&utm_medium=internal_link&utm_campaign=ETA_Internal_WebMessenger'
  },
  evisa: {
    definition: 'electronic visa',
    deploymentId: getEnvValueByKey('EVISA_DEPLOYMENT_ID'),
    localStorageKey: 'evisa-genesys-session',
    serviceName: 'eVisa',
    serviceSubText: 'an eVisa.',
    errorContactLink: 'https://www.ask-about-getting-access-evisa.homeoffice.gov.uk/start',
    gaUtmParam: '?utm_source=webmessenger&utm_medium=internal_link&utm_campaign=EVISA_Internal_WebMessenger'
  },
  euss: {
    definition: 'EU settlement scheme',
    deploymentId: getEnvValueByKey('EUSS_DEPLOYMENT_ID'),
    localStorageKey: 'euss-genesys-session',
    serviceName: 'EUSS',
    serviceSubText: 'the EUSS (EU Settlement Service).',
    errorContactLink: 'https://eu-settled-status-enquiries.service.gov.uk/start',
    gaUtmParam: '?utm_source=webmessenger&utm_medium=internal_link&utm_campaign=EUSS_Internal_WebMessenger'
  },
  statementDate: '(10 November 2025)',
  statementReviewedDate: '(10 November 2025)',
  websiteUpdates: '(30 October 2025)',
  logApiEndpoint: getEnvValueByKey('LOG_ENDPOINT'),
  feedback: {
    eta: 'https://ukhomeoffice.qualtrics.com/jfe/form/SV_396eOdMT06w04YK',
    evisa: 'https://homeoffice.eu.qualtrics.com/jfe/form/SV_0iJqpkEWRXvXlgW',
    euss: 'https://ukhomeoffice.qualtrics.com/jfe/form/SV_5gmFakdRFxtnL8y'
  }
};
