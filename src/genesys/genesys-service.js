import logData from '../components/utils/logging';
import {
  getConversationId, 
  removeConversationId 
} from '../conversation/conversation-storage';

/**
 * The core Genesys functions can only be initialised once. We provide this singleton
 * service to provide subscribers to the Genesys events and allow for callback functions to handle
 * data changing events in the caller.
 */
let isInitialized = false;

/**
 * Before the service can interact with Genesys, it must be initialized.
 * This function loads the Genesys script and sets up the environment.
 * 
 * @param {environment} the genesys environment 
 * @param {deploymentId} the genesys deploymentId 
 */
export function loadGenesysScript(environment, deploymentId) {
  // Queue the configuration before loading the SDK
  window._genesysJs = 'Genesys';
  window.Genesys = window.Genesys || function () {
    (window.Genesys.q = window.Genesys.q || []).push(arguments);
  };
  window.Genesys.t = 1 * new Date();
  window.Genesys.c = {
    environment: environment,
    deploymentId: deploymentId,
    debug: false
  };

  const script = document.createElement('script');
  script.src = 'https://apps.euw2.pure.cloud/genesys-bootstrap/genesys.min.js';
  script.async = true;
  script.charset = 'utf-8';
  script.id = 'genesys-sdk-script';
  document.head.appendChild(script);
  
  logData({ 
    level: 'info', 
    message: 'Genesys script executed and SDK loaded successfully', 
    metadata: { conversationId: getConversationId() }
  });
}

/* eslint-disable max-len */
/**
 * This function initializes the Genesys conversation, by subscribing to a series of core
 * events output from Genesys. The ordering is important for a chat to become active; 
 * 1. Subscribe to the ready event (https://developer.genesys.cloud/commdigital/digital/webmessaging/messengersdk/SDKCommandsEvents/messagingServicePlugin#messagingservice-ready)
 * 2. Subscribe to the startConversation event (https://developer.genesys.cloud/commdigital/digital/webmessaging/messengersdk/SDKCommandsEvents/messagingServicePlugin#messagingservice-startconversation)
 * 3. Register for any session clearing events (sessionCleared, conversationReset, conversationCleared)
 * Once the conversation is started, all other Genesys events and commands can be used.
 * @param {onGenesysReady} the onGenesysReady callback function supplied by the caller to state the SDK is ready for interaction 
 */
/* eslint-enable max-len */
export function initialiseGenesysConversation(onGenesysReady, onError, localStorageKey) {
  if (isInitialized || !window.Genesys) {
    /**
     * Check for an active session in local storage, if not found start a new conversation.
     * This covers the specific scenario where a user ends the chat, but then clicks the browser
     * back button instead of the link to start a new chat. In this case, the Genesys SDK is already and initialised,
     * but no conversation exists, so we need to start a new one to avoid an issue if the user ends the chat again.
     */ 
    const activeSessionExists = localStorage.getItem(localStorageKey);
    if (!activeSessionExists) {
      startConversation(localStorageKey, onError, onGenesysReady);
    }
    return;
  }
  isInitialized = true;

  // Subscribe to the ready event on a fresh Genesys instance
  window.Genesys('subscribe', 'MessagingService.ready', function () {
    logData({ 
      level: 'info', 
      message: 'Genesys SDK configured and ready', 
      metadata: { conversationId: getConversationId() }
    });
    // Check local storage for active session
    const activeSessionExists = localStorage.getItem(localStorageKey);
    if (!activeSessionExists) {
      startConversation(localStorageKey, onError, onGenesysReady);
    } else {
      // Already active session, just call ready
      onGenesysReady();
    }

    // Register for potential session clearing events so we can clear the custom local storage key
    registerForSessionClearingEvents(localStorageKey);
  });
}

function startConversation(localStorageKey, onError, onGenesysReady) {
  window.Genesys('command', 'MessagingService.startConversation',
    function () {
      logData({ 
        level: 'info', 
        message: 'Conversation started successfully', 
        metadata: { conversationId: getConversationId() } 
      });
      localStorage.setItem(localStorageKey, 'true');
      onGenesysReady();
    },
    function () {
      logData({ 
        level: 'error', 
        message: 'Error trying to start conversation', 
        metadata: { conversationId: getConversationId() } 
      });
      onError();
    }
  );
}

/* eslint-disable max-len */
/**
 * Subscribe to the Genesys messagesReceived event: 
 * https://developer.genesys.cloud/commdigital/digital/webmessaging/messengersdk/SDKCommandsEvents/messagingServicePlugin#messagingservice-messagesreceived
 * @param {onMessagesReceived} onMessagesReceived callback to handle incoming messages
 */
/* eslint-enable max-len */
export function subscribeToGenesysMessages(onMessagesReceived) {
  window.Genesys('subscribe', 'MessagingService.messagesReceived', function ({ data }) {
    onMessagesReceived(data.messages);
  });
};

/* eslint-disable max-len */
/**
 * Subscribe to the Genesys oldMessages and historyComplete events:
 * - https://developer.genesys.cloud/commdigital/digital/webmessaging/messengersdk/SDKCommandsEvents/messagingServicePlugin#messagingservice-oldmessages
 * - https://developer.genesys.cloud/commdigital/digital/webmessaging/messengersdk/SDKCommandsEvents/messagingServicePlugin#messagingservice-historycomplete
 * @param {onFetchHistory} onFetchHistory callback to handle incoming historical messages
 * @param {onHistoryComplete} onHistoryComplete callback to handle history fetch completion
 */
/* eslint-enable max-len */
export function subscribeToGenesysOldMessages(onFetchHistory, onHistoryComplete) {
  window.Genesys('subscribe', 'MessagingService.oldMessages', function ({ data }) {
    onFetchHistory(data);
  });

  window.Genesys('subscribe', 'MessagingService.historyComplete', function () {
    logData({ 
      level: 'debug', 
      message: 'All history fetched successfully', 
      metadata: { conversationId: getConversationId() } 
    });
    onHistoryComplete();
  });
}

/* eslint-disable max-len */
/**
 * Subscribe to the Genesys session restored event to get the latest 25 messages from the active conversation:
 * https://developer.genesys.cloud/commdigital/digital/webmessaging/messengersdk/SDKCommandsEvents/messagingServicePlugin#messagingservice-restored
 * @param {onSessionRestored} onSessionRestored callback to handle restoring recent session messages
 */
/* eslint-enable max-len */
export function subscribeToSessionRestored(onSessionRestored) {  
  window.Genesys('subscribe', 'MessagingService.restored', function ({ data }) {
    logData({ 
      level: 'info', 
      message: 'Session restored successfully for active conversation',
      metadata: { conversationId: getConversationId() }
    });
    onSessionRestored(data);
  });
}

/**
 * Function handler for sending a supplied messaged to Genesys
 * via the sendMessage command
 * @param {message} the message to send to Genesys
 */
export function sendMessageToGenesys(message, onError) {
  window.Genesys('command', 'MessagingService.sendMessage', {
    message: message
  },
  function () {
    logData({ 
      level: 'debug', 
      message: 'Message sent successfully', 
      metadata: { conversationId: getConversationId() } 
    });
  },
  function () {
    logData({ 
      level: 'error', 
      message: 'sendMessage call rejected', 
      metadata: { conversationId: getConversationId() } 
    });
    onError();
  });
}

export function fetchMessageHistory(onError) {
  window.Genesys('command', 'MessagingService.fetchHistory',
    function () {
      logData({ 
        level: 'debug', 
        message: 'Message history successfully fetched', 
        metadata: { conversationId: getConversationId() } 
      });
    },
    function () {
      logData({ 
        level: 'error', 
        message: 'Failed to fetch message history', 
        metadata: { conversationId: getConversationId() } 
      });
      onError();
    }
  );
}

export function subscribeAgentTyping(onAgentTyping) {
  window.Genesys('subscribe', 'MessagingService.typingReceived', onAgentTyping);
}

export function unSubscribeAgentTyping(onAgentTyping) {
  window.Genesys('subscribe', 'MessagingService.typingTimeout', onAgentTyping);
}

export function subscribeToErrors(onError) {
  window.Genesys('subscribe', 'MessagingService.error', function ({ data }) {
    logData({ 
      level: 'error', 
      message: `Genesys error reported: ${JSON.stringify(data)}`,
      metadata: { conversationId: getConversationId() }
    });
    onError();
  });
};

/* eslint-disable max-len */
/**
 * Register for Genesys events that indicate the current session has been cleared or reset.
 * 1. MessagingService.sessionCleared (https://developer.genesys.cloud/commdigital/digital/webmessaging/messengersdk/SDKCommandsEvents/messagingServicePlugin#messagingservice-sessioncleared)
 * 2. MessagingService.conversationReset (https://developer.genesys.cloud/commdigital/digital/webmessaging/messengersdk/SDKCommandsEvents/messagingServicePlugin#messagingservice-conversationreset)
 * 3. MessagingService.conversationCleared (https://developer.genesys.cloud/commdigital/digital/webmessaging/messengersdk/SDKCommandsEvents/messagingServicePlugin#messagingservice-conversationcleared)
 * 
 * The aim here is that if the Genesys session has been cleared in any way, we also remove the custom local storage
 * key we use to track if there is an active session. This ensures that if the user continues to interact with the chat
 * after a session clear, a new conversation will be started.
 * @param {string} localStorageKey the local storage key used to access the active session
 */
/* eslint-enable max-len */
function registerForSessionClearingEvents(localStorageKey) {
  window.Genesys('subscribe', 'MessagingService.sessionCleared', () => {
    logData({ 
      level: 'debug', 
      message: 'Session cleared', 
      metadata: { conversationId: getConversationId() } 
    });
    removeActiveSessionFromLocalStorage(localStorageKey);    
  });

  window.Genesys('subscribe', 'MessagingService.conversationReset', () => {
    logData({ 
      level: 'debug', 
      message: 'Conversation reset',
      metadata: { conversationId: getConversationId() }
    });
    removeActiveSessionFromLocalStorage(localStorageKey);    
  });

  window.Genesys('subscribe', 'MessagingService.conversationCleared', () => {
    logData({ 
      level: 'debug', 
      message: 'Conversation cleared',
      metadata: { conversationId: getConversationId() }
    });
    removeActiveSessionFromLocalStorage(localStorageKey);    
  });
};

function removeActiveSessionFromLocalStorage(localStorageKey) {
  logData({ 
    level: 'debug', 
    message: `Clearing session key for service ${localStorageKey}`, 
    metadata: { localStorageKey } 
  });
  localStorage.removeItem(localStorageKey);
  removeConversationId();
};

/* eslint-disable max-len */
/**
 * Clear the conversation in Genesys to clear this conversation session.
 * This will clear all existing messages on the Genesys end: https://developer.genesys.cloud/commdigital/digital/webmessaging/messengersdk/SDKCommandsEvents/messagingServicePlugin#messagingservice-clearconversation
 * @param {localStorageKey} the key of the local storage item to remove to indicate no active session
 */
/* eslint-enable max-len */
export function clearConversation(localStorageKey) {  
  removeActiveSessionFromLocalStorage(localStorageKey);
  window.Genesys('command', 'MessagingService.clearConversation',
    function () {},
    function () {
      logData({ 
        level: 'error', 
        message: 'Error clearing conversation', 
        metadata: { conversationId: getConversationId() } 
      });
    }
  );
}

/* eslint-disable max-len */
/**
 * Subscribe to the Genesys offline event:
 * Published when connection goes offline due to no connectivity.
 * MessagingService.offline: (https://developer.genesys.cloud/commdigital/digital/webmessaging/messengersdk/SDKCommandsEvents/messagingServicePlugin#messagingservice-offline)
 * @param {onOffline} callback to handle offline state
 */
export function subscribeToGenesysOffline(onOffline) {
  window.Genesys('subscribe', 'MessagingService.offline', function () {
    logData({ 
      level: 'info', 
      message: 'Genesys connection lost (offline)', 
      metadata: { conversationId: getConversationId() } 
    });
    onOffline();
  });
}

/* eslint-disable max-len */
/**
 * Subscribe to the Genesys reconnected event:
 * Published when WebSocket connection is back after previous reconnecting attempt.
 * MessagingService.reconnected: (https://developer.genesys.cloud/commdigital/digital/webmessaging/messengersdk/SDKCommandsEvents/messagingServicePlugin#messagingservice-reconnected)
 * @param {onReconnected} callback to handle reconnected state
 */
export function subscribeToGenesysReconnected(onReconnected) {
  window.Genesys('subscribe', 'MessagingService.reconnected', function () {
    logData({ 
      level: 'info', 
      message: 'Genesys connection re-established (reconnected)', 
      metadata: { conversationId: getConversationId() } 
    });
    onReconnected();
  });
}

// Export the registerForSessionClearingEvents for testing only
if (process.env.NODE_ENV === 'test') {
  exports._test_registerForSessionClearingEvents = registerForSessionClearingEvents;
}
