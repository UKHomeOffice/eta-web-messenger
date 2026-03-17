const formatDate = (dateToFormat) => {
  const time = new Date(dateToFormat);
  const formattedTime = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(time);

  return formattedTime;
};

const stringsAreEqualIgnoringCase = (str1, str2) => {
  return str1.toLowerCase() === str2.toLowerCase();
};

const isConnectedToAgent = (message) => {
  return message?.direction === 'Outbound' &&
    message?.channel?.from?.nickname;
};

const getCurrentAgentName = (currentMessage) => {
  if (isConnectedToAgent(currentMessage))
    return currentMessage.channel.from.nickname;
};

module.exports = {
  formatDate,
  stringsAreEqualIgnoringCase,
  isConnectedToAgent,
  getCurrentAgentName
};
