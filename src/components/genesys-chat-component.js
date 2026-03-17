import { useEffect, useRef, useState } from 'react';
import { useNavigate, useNavigationType } from 'react-router';
import LoadingSpinner from '@hods/loading-spinner';
import {
  fetchMessageHistory,
  initialiseGenesysConversation,
  loadGenesysScript,
  sendMessageToGenesys,
  subscribeAgentTyping,
  unSubscribeAgentTyping,
  subscribeToGenesysMessages,
  subscribeToGenesysOldMessages,
  subscribeToSessionRestored,
  subscribeToGenesysReconnected,
  subscribeToGenesysOffline,
  subscribeToErrors,
  clearConversation
} from '../genesys/genesys-service';
import ChatForm from '../components/chat/chat-form';
import Messages from '../components/message/messages';
import PageHeading from '../components/content/page-heading';
import {
  clearAgentTypingOnOutboundHumanMessage,
  mapHistoricalMessagesToStandardMessageFormat,
  checkChatEnded
} from './utils';
import TypingIndicator from '../components/message/typing-indicator';
import {
  getCurrentAgentName,
  setAgentConnectedBanner,
  setAgentDisconnectedBanner,
  setOfflineBanner,
  setReconnectedBanner
} from '../../utils/genesys-agent';
import ErrorComponent from '../components/error/error-component';
import {
  setHideContentProperty,
  getStructureMessageIndex,
  setHideContentPropertyWithIndex,
  setPreviousStructureHideTrue,
  setHideContentToHistoricalMessages
} from '../../utils/structured-message';
import EndChatModal from '../components/chat/end-chat-modal';
import { getEnvValueByKey } from '../env-bootstrap';
import { useConversationId } from '../conversation/conversation-provider';
import logData from './utils/logging';

/**
 * A common implementation of a Genesys Chat Component. This component can be reused for a standard web messenger chat.
 * 
 * @param {deploymentId} the deployment ID for the Genesys instance
 * @param {localStorageKey} the local storage key to store the session (e.g. "<service>-genesys-session")
 * @param {serviceName} the name of the service (e.g. ETA, eVisa, EUSS)
 * @param {serviceSubText} the subtext for the service (e.g. "an ETA (electronic travel authorisation).")
 * @param {errorContactLink} the link to the contact form in case of an error
 * @returns Genesys Chat Component
 */
export default function GenesysChatComponent({
  deploymentId,
  localStorageKey,
  serviceName,
  serviceSubText,
  errorContactLink,
}) {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [historicalMessages, setHistoricalMessages] = useState([]);
  const [genesysIsReady, setGenesysIsReady] = useState(false);
  const [allHistoryFetched, setAllHistoryFetched] = useState(false);
  const [shouldScrollToLatestMessage, setShouldScrollToLatestMessage] = useState(false);
  const [agentIsTyping, setAgentIsTyping] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [isErrorState, setIsErrorState] = useState(false);
  const lastMessageRef = useRef(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showEndChatModal, setShowEndChatModal] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const hasReconnectedRef = useRef(false);

  const conversationId = useConversationId();

  let navigate = useNavigate();
  const navigationType = useNavigationType();

  /**
   * Initialise the Genesys SDK script if it hasn't been loaded yet.
   */
  useEffect(() => {
    if (!window.Genesys) {
      loadGenesysScript(getEnvValueByKey('GENESYS_ENVIRONMENT'), deploymentId);
    } else {
      setGenesysIsReady(true);
    }
  }, []);

  /**
   * Initialise the Genesys conversation when the Genesys SDK is ready.
   */
  useEffect(() => {
    if (window.Genesys || navigationType === 'POP') {
      initialiseGenesysConversation(
        () => setGenesysIsReady(true),
        () => setIsErrorState(true),
        localStorageKey
      );
    }
  }, []);

  /**
   * Subscribe to Genesys messages received once the Genesys SDK is ready.
   * We pass a callback function to set state with the new messages. As part of this
   * function we handle several important tasks:
   * - Set the shouldScrollToLatestMessage state to true to ensure the latest message is visible
   * - Try to set the agent name from the latest message received (if the user has asked to speak to an agent)
   * - Merge the new messages with the existing messages state, ensuring we format them to the standard message format
   * - Clear the agent typing indicator if an outbound human message is received
   */
  useEffect(() => {
    if (genesysIsReady) {
      subscribeToGenesysMessages((newMessages) => {
        setShouldScrollToLatestMessage(true);
        setAgentName(getCurrentAgentName(newMessages[0]));
        setMessages((prevMessages) => {
          const currentMessages = setPreviousStructureHideTrue(prevMessages);
          let newState = [...currentMessages, ...setHideContentProperty(newMessages, false)];
          setMessageIndex(getStructureMessageIndex(newState));
          if (checkChatEnded(newState)) {
            newState = setAgentDisconnectedBanner(newState);
          }
          return newState;
        });
        clearAgentTypingOnOutboundHumanMessage(
          newMessages[0],
          () => setAgentIsTyping(false)
        );
      });
    }
  }, [genesysIsReady]);

  /**
   * Subscribe to Genesys connection status events (offline and reconnected) once the Genesys SDK is ready.
   * This effect ensures that the chat displays appropriate banners when the user goes offline or comes back online.
   */
  useEffect(() => {
    if (genesysIsReady) {
      subscribeToGenesysOffline(() => {
        setIsOffline(true);
        setMessages((prevMessages) => setOfflineBanner(prevMessages));
      });
      subscribeToGenesysReconnected(() => {
        // Set a reference to indicate we've reconnected before
        hasReconnectedRef.current = true;
        setIsOffline(false);
        setTimeout(() => {
          setMessages((prevMessages) => setReconnectedBanner(prevMessages));
        }, 10); // small delay to allow offline banner to be added first
      });
    }
  }, [genesysIsReady]);

  /**
   * Subscribe to older Genesys messages once the Genesys SDK is ready.
   * We pass a callback function to set state with the historical messages
   * and also merge them with the main messages state, after we've formatted
   * them to the standard message format.
   */
  useEffect(() => {
    if (genesysIsReady) {
      subscribeToGenesysOldMessages(
        (historicalMessages) => {
          const currentHistorialMessages = setHideContentToHistoricalMessages(historicalMessages.messages);
          setHistoricalMessages((prevMessages) => [...prevMessages, ...currentHistorialMessages]);
          mergeChatHistory(currentHistorialMessages);
        },
        () => setAllHistoryFetched(true)
      );
    }
  }, [genesysIsReady]);

  /**
   * Subscribe to session restored events to fetch historical messages.
   * This will fetch a subset (most recent) of previous messages from Genesys.
   * As these messages are in the 'historical' format, we need to map them to the 
   * standard message format before merging them with the main messages state.
   */
  useEffect(() => {
    if (genesysIsReady) {
      subscribeToSessionRestored((historicalMessages) => {
        /**
         * If page is refreshed this will assign hideContent 
         * property to recieved old messages from Genesys.
         * 
         * Only restore session messages if this is not a reconnect event. I.e.
         * the user has not lost connection and reconnected.
         */
        if (!hasReconnectedRef.current) {
          const currentHistorialMessages = setHideContentToHistoricalMessages(historicalMessages.messages);

          setHistoricalMessages((prevMessages) => [...prevMessages, ...currentHistorialMessages]);

          mergeChatHistory(currentHistorialMessages);

          setShouldScrollToLatestMessage(true);
        }
      });
    }
  }, [genesysIsReady]);

  /**
   * Setup agent typing indicator. Create a callback function to pass to the Genesys subcription,
   * which will set state to display the typing indicator once typingReceived event is emitted from Genesys.
   * We also subcribe to the typingTimeout event through a unsubcribeAgentTyping callback to ensure the indicator
   * is removed when the agent has stopped typing. 
   */
  useEffect(() => {
    const onAgentTyping = () => {
      setAgentIsTyping(true);
      setMessages((prevMessages) => setAgentConnectedBanner(prevMessages));
    };
    subscribeAgentTyping(onAgentTyping);
    unSubscribeAgentTyping(() => setAgentIsTyping(false));
  }, []);

  /**
   * Subscribe to Genesys errors once the SDK is ready.
   */
  useEffect(() => {
    if (genesysIsReady) {
      subscribeToErrors(() => setIsErrorState(true));
    }
  }, [genesysIsReady]);

  /*
   * Ensure the last message is the one visible when messages load (to cater for previous messages).
   * By using `block: nearest` it ensures only the div containing the messages gets scrolled, and not
   * the entire page.
   */
  useEffect(() => {
    if (shouldScrollToLatestMessage) {
      scrollToLatestMessage();
    }
  }, [messages, shouldScrollToLatestMessage]);

  const scrollToLatestMessage = () => {
    lastMessageRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  };

  const mergeChatHistory = (historicalMessages) => {
    const mappedMessages = mapHistoricalMessagesToStandardMessageFormat(historicalMessages);

    // When merging chat history, we don't want to scroll to the latest message 
    setShouldScrollToLatestMessage(false);
    setMessages((prevMessages) => [...prevMessages, ...mappedMessages].reverse());
  };

  const handleSendMessageToGenesys = () => {
    sendMessageToGenesys(
      userInput,
      () => setIsErrorState(true)
    );
  };

  const sendMessage = (event) => {
    event.preventDefault();
    handleSendMessageToGenesys();
    if (messageIndex !== -1 && userInput.length !== 0) {
      setMessages((prevMessages) => setHideContentPropertyWithIndex(messageIndex, prevMessages, true));
    }
    setUserInput('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessageToGenesys();
      if (messageIndex !== -1) {
        setMessages((prevMessages) => setHideContentPropertyWithIndex(messageIndex, prevMessages, true));
      }
      setUserInput('');
    }
  };

  const handleSetInputMessage = (value) => {
    setUserInput(value);
  };

  const handleQuickReply = (event, reply) => {
    event.preventDefault();
    sendMessageToGenesys(reply);
  };

  const handleEndChat = (event) => {
    event.preventDefault();
    setShowEndChatModal(false);

    logData({
      level: 'info',
      message: 'Ending conversation as per user request (calling clearConversation)',
      metadata: { conversationId }
    });

    clearConversation(localStorageKey);

    navigate('/end-chat-confirmation', {
      state: {
        serviceName: serviceName.toLowerCase()
      }
    });
  };

  const handleFetchMessageHistory = () => {
    fetchMessageHistory(() => setIsErrorState(true));
  };

  return (
    <>
      {isErrorState && <ErrorComponent contactFormLink={errorContactLink} />}
      {!isErrorState &&
        <PageHeading
          serviceName={serviceName}
          serviceSubText={serviceSubText}
        />
      }
      {!isErrorState && !genesysIsReady &&
        <LoadingSpinner>Loading web chat</LoadingSpinner>
      }
      {!isErrorState && genesysIsReady &&
        <>
          <Messages
            messages={messages}
            historicalMessages={historicalMessages}
            lastMessageRef={lastMessageRef}
            handleQuickReply={handleQuickReply}
            fetchMessageHistory={handleFetchMessageHistory}
            allHistoryFetched={allHistoryFetched}
            serviceName={serviceName.toLowerCase()}
          />
          {agentIsTyping &&
            <TypingIndicator isAgentTyping={agentIsTyping} agentName={agentName} />
          }
          {showEndChatModal &&
            <EndChatModal
              showModal={showEndChatModal}
              handleCloseModal={() => setShowEndChatModal(false)}
              handleEndChat={handleEndChat}
            />
          }
          <hr />
          <ChatForm
            inputMessage={userInput}
            setInputMessage={handleSetInputMessage}
            sendMessage={sendMessage}
            handleKeyPress={handleKeyPress}
            genesysIsReady={genesysIsReady}
            showEndChatModal={() => setShowEndChatModal(true)}
            isOffline={isOffline}
          />
        </>
      }
    </>
  );
}
