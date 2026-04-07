const config = require('../config');

export const getFeedbackUrl = (serviceUrl) => {
  let feedbackUrl;

  switch (serviceUrl) {
    case '/eta':
      feedbackUrl = config.feedback.eta;
      break;
    default:
      feedbackUrl = '#';
      break;
  }
  return feedbackUrl;
};
