const config = require('../config');

export const getFeedbackUrl = (serviceUrl) => {
  let feedbackUrl;

  switch (serviceUrl) {
    case '/eta':
      feedbackUrl = config.feedback.eta;
      break;
    case '/evisa':
      feedbackUrl = config.feedback.evisa;
      break;
    case '/euss':
      feedbackUrl = config.feedback.euss;
      break;
    default:
      feedbackUrl = '#';
      break;
  }
  return feedbackUrl;
};
