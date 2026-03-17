/**
 * Utility functions for route components
 */

/**
 * When message history is fetched from Genesys, 
 * it comes in a different format than the standard message format used in the app.
 * So we need to map the historical messages to the standard message format.
 * @param {historicalMessages} a list of historical message object from Genesys 
 * @returns a list of correctly formatted message objects
 */
function mapHistoricalMessagesToStandardMessageFormat(historicalMessages) {
  return historicalMessages.map(message => {
    return {
      channel: {
        time: message.timestamp,
        messageId: message.id
      },
      direction: message.messageType,
      type: message.type,
      text: message.text,
      originatingEntity: message.originatingEntity,
      content: message.quickReplies
    };
  });
}

/**
 * Clears the agent typing indicator when an outbound message from a live agent (Human) is sent.
 * @param {message} the message received from Genesys
 */
function clearAgentTypingOnOutboundHumanMessage(message, agentTypingCallback) {
  if (message?.direction === 'Outbound' && message?.originatingEntity === 'Human') {
    agentTypingCallback();
  }
}

let previousHasEnded = false;

/**
 * Checks if the chat has ended by looking for a Presence Disconnect event
 * in the final outbound message from a human.
 * @param {Array} messages - The array of message objects to check.
 * @returns {boolean} - True if chat ended, false otherwise.
 */
function checkChatEnded(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    previousHasEnded = false;
    return false;
  }

  const lastMessage = messages[messages.length - 1];
  const hasEnded =
    lastMessage.originatingEntity === 'Human' &&
    lastMessage.direction === 'Outbound' &&
    Array.isArray(lastMessage.events) &&
    lastMessage.events.some(
      (event) =>
        event.eventType === 'Presence' &&
        event.presence?.type === 'Disconnect'
    );

  const shouldShowHint = hasEnded && !previousHasEnded;
  previousHasEnded = hasEnded;
  return shouldShowHint;
}


export { 
  mapHistoricalMessagesToStandardMessageFormat,
  clearAgentTypingOnOutboundHumanMessage,
  checkChatEnded
};
