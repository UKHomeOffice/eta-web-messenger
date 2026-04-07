jest.mock('../../src/genesys/genesys-service.js', () => ({
  loadGenesysScript: jest.fn(),
  sendMessageToGenesys: jest.fn(),
  subscribeAgentTyping: jest.fn(),
  unSubscribeAgentTyping: jest.fn(),
  initialiseGenesysConversation: jest.fn(),
  subscribeToGenesysMessages: jest.fn(),
  subscribeToGenesysOldMessages: jest.fn(),
  subscribeToSessionRestored: jest.fn(),
  subscribeToGenesysOffline: jest.fn(),
  subscribeToGenesysReconnected: jest.fn(),
  fetchMessageHistory: jest.fn(),
  subscribeToErrors: jest.fn(),
  clearConversation: jest.fn(),
}));

import '@testing-library/jest-dom';

import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import {
  initialiseGenesysConversation,
  subscribeToGenesysMessages,
  subscribeToGenesysOldMessages,
  subscribeToSessionRestored,
  fetchMessageHistory,
  subscribeAgentTyping,
  unSubscribeAgentTyping,
  subscribeToErrors,
  clearConversation,
  subscribeToGenesysReconnected,
  subscribeToGenesysOffline,
} from '../../src/genesys/genesys-service.js';
import GenesysChatComponent from '../../src/components/genesys-chat-component.js';

import inboundMessages from '../inbound-messages.json';
import outboundMessages from '../outbound-messages.json';
import restoredMessages from '../restored-messages.json';
import largeSetRestoredMessages from '../large-set-restored-messages.json';
import incomingMessage from '../incoming-message.json';
import withStructuredMessages from '../structured-messages.json';

import {
  getStructureMessageIndex,
  setPreviousStructureHideTrue,
} from '../../utils/structured-message.js';

const { axe, toHaveNoViolations } = require('jest-axe');
expect.extend(toHaveNoViolations);

beforeAll(() => {
  // Mock scrollIntoView because JSDOM doesn't support it
  Element.prototype.scrollIntoView = jest.fn();

  // Mock the dialog prototype methods as JSDOM does not implement them
  window.HTMLDialogElement.prototype.showModal = jest.fn();
  window.HTMLDialogElement.prototype.close = jest.fn();
});

/* eslint-disable no-unused-vars */
afterEach(() => {
  jest.clearAllMocks();
  cleanup();
  // Ensure any fake timers used in individual tests are reset so they don't
  // affect subsequent tests and cause unexpected timeouts when running the
  // whole test suite.
  try {
    jest.useRealTimers();
  } catch (e) {
    // Some Jest environments may not support switching timers; ignore errors
  }
});

const renderGenesysChatComponent = () => render(
  <MemoryRouter>
    <GenesysChatComponent
      deploymentId="test-deployment-id"
      localStorageKey="test-local-storage-key"
      serviceName="ETA"
      serviceSubText="an ETA (electronic travel authorisation)."
      errorContactLink="http://localhost/example-error-link"    
    />
  </MemoryRouter>
);

describe('Genesys Chat Component', () => {
  test('renders component with correct initial content', () => {
    renderGenesysChatComponent();

    const headings = screen.getAllByRole('heading');
    expect(headings[0]).toHaveTextContent('Home Office ETA Chat');
    expect(headings[1]).toHaveTextContent('Loading web chat');

    const subText = screen.getByText(/Ask our/i);
    expect(subText).toHaveTextContent('Ask our digital assistant about an ETA');
  });

  test('renders component with with web chat form when genesys is ready', async () => {
    // Mock the Genesys window object 
    window.Genesys = {};

    initialiseGenesysConversation.mockImplementation((onGenesysReady) => {
      onGenesysReady();
    });

    renderGenesysChatComponent();

    const heading = screen.getByRole('heading');
    expect(heading).toHaveTextContent('Home Office ETA Chat');

    const subText = screen.getByText(/Ask our/i);
    expect(subText).toHaveTextContent('Ask our digital assistant about an ETA');

    expect(screen.getByTestId('chat-messenger-form')).toBeInTheDocument();
  });

  test('renders inbound message when message is sent to genesys', async () => {
    // Mock the Genesys window object 
    window.Genesys = {};

    initialiseGenesysConversation.mockImplementation((onGenesysReady) => {
      onGenesysReady();
    });

    subscribeToGenesysMessages.mockImplementation((onMessagesReceived) => {
      onMessagesReceived([inboundMessages[0]]);
    });

    renderGenesysChatComponent();

    const heading = screen.getByRole('heading');
    expect(heading).toHaveTextContent('Home Office ETA Chat');

    const subText = screen.getByText(/Ask our/i);
    expect(subText).toHaveTextContent('Ask our digital assistant about an ETA');
    expect(screen.getByRole('log')).toBeInTheDocument();

    const messages = screen.getAllByTestId('inbound-message');
    expect(messages[0]).toBeInTheDocument();
    expect(messages[0]).toHaveTextContent("What's the price for this service");

    const messageMetaData = screen.queryByText(/You at/i);
    expect(messageMetaData).toHaveTextContent('You at 09:38');
  });

  test('renders outbound message when message is received from genesys', async () => {
    // Mock the Genesys window object 
    window.Genesys = {};

    initialiseGenesysConversation.mockImplementation((onGenesysReady) => {
      onGenesysReady();
    });

    subscribeToGenesysMessages.mockImplementation((onMessagesReceived) => {
      onMessagesReceived([outboundMessages[0]]);
    });

    renderGenesysChatComponent();

    const heading = screen.getByRole('heading');
    expect(heading).toHaveTextContent('Home Office ETA Chat');

    const subText = screen.getByText(/Ask our/i);
    expect(subText).toHaveTextContent('Ask our digital assistant about an ETA');

    expect(screen.getByRole('log')).toBeInTheDocument();

    const messages = screen.getAllByTestId('outbound-message');
    expect(messages[0]).toBeInTheDocument();
    expect(messages[0]).toHaveTextContent("Hello and welcome to the ETA webchat service. Please ask me a question relating to the ETA process. You're communicating with a computer. Please do not disclose any personal or sensitive information.");

    const messageMetaData = screen.queryByText(/Digital assistant at/i);
    expect(messageMetaData).toHaveTextContent('Digital assistant at 09:38');
  });

  test('renders restored messages when previous genesys session is active', async () => {
    // Mock the Genesys window object 
    window.Genesys = {};

    initialiseGenesysConversation.mockImplementation((onGenesysReady) => {
      onGenesysReady();
    });

    subscribeToGenesysMessages.mockImplementation((onMessagesReceived) => {
      onMessagesReceived([]);
    });

    subscribeToSessionRestored.mockImplementation((onSessionRestored) => {
      onSessionRestored(restoredMessages);
    });

    renderGenesysChatComponent();

    const heading = screen.getByRole('heading');
    expect(heading).toHaveTextContent('Home Office ETA Chat');

    const subText = screen.getByText(/Ask our/i);
    expect(subText).toHaveTextContent('Ask our digital assistant about an ETA');

    expect(screen.getByRole('log')).toBeInTheDocument();

    const outboundMessageHistory = screen.getAllByTestId('outbound-message');
    expect(outboundMessageHistory).toHaveLength(2);
    expect(outboundMessageHistory[1]).toBeInTheDocument();
    expect(outboundMessageHistory[1]).toHaveTextContent('Welcome to the webchat, in few word how can i help you today?');
    expect(outboundMessageHistory[0]).toBeInTheDocument();
    expect(outboundMessageHistory[0]).toHaveTextContent('Ok, for more information please see the documentation on our home page');

    const inboundMessageHistory = screen.getAllByTestId('inbound-message');
    expect(inboundMessageHistory).toHaveLength(2);
    expect(inboundMessageHistory[1]).toBeInTheDocument();
    expect(inboundMessageHistory[1]).toHaveTextContent('Hello, I need help with my application');
    expect(inboundMessageHistory[0]).toBeInTheDocument();
    expect(inboundMessageHistory[0]).toHaveTextContent('Please connect me to an agent');

    const messageMetaData = screen.queryAllByText(/Digital assistant at/i);
    messageMetaData.forEach((metaData) =>
      expect(metaData).toHaveTextContent('Digital assistant at 09:39'));
  });

  test('renders more historical messages when load more messages event is triggered', async () => {
    // Mock the Genesys window object 
    window.Genesys = {};

    // Setup callback placeholders for later use
    let onFetchHistoryCallback;
    let onHistoryCompleteCallback;

    initialiseGenesysConversation.mockImplementation((onGenesysReady) => {
      onGenesysReady();
    });

    subscribeToGenesysMessages.mockImplementation((onMessagesReceived) => {
      onMessagesReceived([]);
    });

    subscribeToSessionRestored.mockImplementation((onSessionRestored) => {
      onSessionRestored(largeSetRestoredMessages);
    });

    subscribeToGenesysOldMessages.mockImplementation((onFetchHistory, onHistoryComplete) => {
      onFetchHistoryCallback = onFetchHistory;
      onHistoryCompleteCallback = onHistoryComplete;
    });

    renderGenesysChatComponent();

    const heading = screen.getByRole('heading');
    expect(heading).toHaveTextContent('Home Office ETA Chat');

    const subText = screen.getByText(/Ask our/i);
    expect(subText).toHaveTextContent('Ask our digital assistant about an ETA');

    expect(screen.getByRole('log')).toBeInTheDocument();

    const outboundMessageHistory = screen.getAllByTestId('outbound-message');
    expect(outboundMessageHistory).toHaveLength(12);

    const inboundMessageHistory = screen.getAllByTestId('inbound-message');
    expect(inboundMessageHistory).toHaveLength(13);

    const assistantMetaData = screen.queryAllByText(/Digital assistant at/i);
    expect(assistantMetaData).toHaveLength(12);

    const userMetaData = screen.queryAllByText(/You at/i);
    expect(userMetaData).toHaveLength(13);

    const loadMoreMessagesButton = await screen.findByRole('button', { name: /Load more messages/i });
    expect(loadMoreMessagesButton).toBeInTheDocument();
    expect(loadMoreMessagesButton).toHaveTextContent('Load more messages');

    const user = userEvent.setup();
    await user.click(loadMoreMessagesButton);
    expect(fetchMessageHistory).toHaveBeenCalledTimes(1);

    // Mock fetching history getting one more message and then setting the history as complete
    act(() => {
      onFetchHistoryCallback({
        messages: [{
          'text': 'Welcome to the webchat, in few word how can i help you today?',
          'messageType': 'outbound',
          'type': 'text',
          'timestamp': '2025-07-31T09:39:00Z',
          'metadata': {
            'correlationId': '00000000-0000-0000-0000-000000000000'
          },
          'originatingEntity': 'Bot'
        }]
      });
      onHistoryCompleteCallback(true);
    });

    // The latest historical message should now be populated in the messages list
    await waitFor(() => {
      const updatedMessages = screen.getAllByTestId('outbound-message');
      expect(updatedMessages).toHaveLength(13);
      expect(updatedMessages[0]).toHaveTextContent('Welcome to the webchat, in few word how can i help you today?');
    });

    // Now that all history is loaded, the load more messages button should be gone
    await waitFor(() => {
      expect(loadMoreMessagesButton).not.toBeInTheDocument();
    });
  });

  test('doesnt restore messages when reconnect event has occured', async () => {
    
    const messages = [outboundMessages[0], inboundMessages[0]];

    // Mock the Genesys window object 
    window.Genesys = {};

    initialiseGenesysConversation.mockImplementation((onGenesysReady) => {
      onGenesysReady();
    });

    subscribeToGenesysMessages.mockImplementation((onMessagesReceived) => {
      onMessagesReceived(messages);
    });

    subscribeToGenesysReconnected.mockImplementation((onReconnected) => {
      onReconnected();
    });

    subscribeToSessionRestored.mockImplementation((onSessionRestored) => {
      onSessionRestored(restoredMessages);
    });

    renderGenesysChatComponent();

    const heading = screen.getByRole('heading');
    expect(heading).toHaveTextContent('Home Office ETA Chat');

    const subText = screen.getByText(/Ask our/i);
    expect(subText).toHaveTextContent('Ask our digital assistant about an ETA');

    expect(screen.getByRole('log')).toBeInTheDocument();

    const outboundMessageHistory = screen.getAllByTestId('outbound-message');
    expect(outboundMessageHistory).toHaveLength(1);
    expect(outboundMessageHistory[0]).toBeInTheDocument();
    expect(outboundMessageHistory[0]).toHaveTextContent('Hello and welcome to the ETA webchat service. Please ask me a question relating to the ETA process. You\'re communicating with a computer. Please do not disclose any personal or sensitive information.');

    const inboundMessageHistory = screen.getAllByTestId('inbound-message');
    expect(inboundMessageHistory).toHaveLength(1);
    expect(inboundMessageHistory[0]).toBeInTheDocument();
    expect(inboundMessageHistory[0]).toHaveTextContent('What\'s the price for this service');
  });

  test('handles user input across multiple lines', async () => {
    // Mock the Genesys window object 
    window.Genesys = {};

    initialiseGenesysConversation.mockImplementation((onGenesysReady) => {
      onGenesysReady();
    });

    subscribeToGenesysMessages.mockImplementation((onMessagesReceived) => {
      onMessagesReceived([]);
    });

    renderGenesysChatComponent();

    const messageInputArea = screen.getByTestId('message-input');
    await userEvent.type(messageInputArea, 'Hello, I need help{shift>}{enter}{/shift}with an ETA');

    expect(messageInputArea).toHaveTextContent('Hello, I need help with an ETA');
  });

  test('display typing indicator when agent is typing', async () => {

    subscribeAgentTyping.mockImplementation((onAgentTyping) => {
      onAgentTyping();
    });

    const { container } = renderGenesysChatComponent();
    expect(screen.queryByRole('status')).not.toBeNull();
    expect(screen.getByTestId('agent-typing')).toHaveClass('show');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('hides typing indicator when agent stops typing', async () => {
    let agentStartTyping;
    let agentStoppedTyping;

    subscribeAgentTyping.mockImplementation((onAgentTyping) => {
      agentStartTyping = onAgentTyping;
    });

    unSubscribeAgentTyping.mockImplementation((onAgentStoppedTyping) => {
      agentStoppedTyping = onAgentStoppedTyping;
    });

    renderGenesysChatComponent();

    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.queryByTestId('agent-typing')).toBeNull();

    act(() => {
      agentStartTyping();
    });
    expect(screen.getByTestId('agent-typing')).toHaveClass('show');

    act(() => {
      agentStoppedTyping();
    });
    expect(screen.queryByTestId('agent-typing')).toBeNull();
  });

  test('hides typing indicator when agent sends message', async () => {
    let messagesReceived;

    subscribeAgentTyping.mockImplementation((onAgentTyping) => {
      onAgentTyping();
    });

    initialiseGenesysConversation.mockImplementation((onGenesysReady) => {
      onGenesysReady();
    });

    subscribeToGenesysMessages.mockImplementation((onMessagesReceived) => {
      messagesReceived = onMessagesReceived;
    });

    renderGenesysChatComponent();

    expect(screen.queryByRole('status')).not.toBeNull();
    expect(screen.getByTestId('agent-typing')).toHaveClass('show');

    const message = {
      'direction': 'Outbound',
      'text': 'Great, this current price for visa categories varies on type of visa',
      'type': 'Text',
      'channel': {
        'time': '2025-07-31T09:38:00Z'
      },
      'metadata': {
        'correlationId': '00000000-0000-0000-0000-000000000000'
      },
      'originatingEntity': 'Human'
    };

    act(() => {
      messagesReceived([message]);
    });

    expect(screen.queryByTestId('agent-typing')).toBeNull();
  });

  test('handleEndChat clears conversation and navigates to end-chat-confirmation page', async () => {
    // Mock the Genesys window object 
    window.Genesys = {};

    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router'), 'useNavigate').mockImplementation(() => mockNavigate);

    // Mock clearConversation to track calls
    clearConversation.mockImplementation(jest.fn());

    renderGenesysChatComponent();

    // Open the end chat modal
    const endChatButton = screen.getByTestId('end-chat-button');
    expect(endChatButton).toBeInTheDocument();
    await userEvent.click(endChatButton);

    // Modal should appear
    const modal = screen.getByTestId('end-chat-modal');
    expect(modal).toBeInTheDocument();

    // Click the confirm end chat button inside the modal
    const confirmEndChatButton = screen.getByTestId('confirm-end-chat-button');
    expect(confirmEndChatButton).toBeInTheDocument();
    await userEvent.click(confirmEndChatButton);

    // clearConversation should be called with ETA_LOCAL_STORAGE_KEY
    expect(clearConversation).toHaveBeenCalledWith('test-local-storage-key');

    expect(mockNavigate).toHaveBeenCalledWith('/end-chat-confirmation', {
      state: { serviceName: 'eta' }
    });
  });

  test('renders offline banner and disables chat form when offline event is triggered', async () => {
    // Mock the Genesys window object 
    window.Genesys = {};

    let goOffline;

    initialiseGenesysConversation.mockImplementation((onGenesysReady) => {
      onGenesysReady();
    });

    subscribeToGenesysMessages.mockImplementation((onMessagesReceived) => {
      onMessagesReceived([]);
    });

    subscribeToGenesysOffline.mockImplementation((onOffline) => {
      goOffline = onOffline;
    });

    renderGenesysChatComponent();

    act(() => {
      goOffline();
    });

    const heading = screen.getByRole('heading');
    expect(heading).toHaveTextContent('Home Office ETA Chat');

    const subText = screen.getByText(/Ask our/i);
    expect(subText).toHaveTextContent('Ask our digital assistant about an ETA');

    expect(screen.getByRole('log')).toBeInTheDocument();

    const offlineBanner = screen.getByText(/You are currently offline/i);
    expect(offlineBanner).toBeInTheDocument();
    expect(offlineBanner).toHaveTextContent('You are currently offline. Messages cannot be sent until reconnected to the internet.');

    await waitFor(() => {
      expect(screen.getByTestId('send-message-button')).toBeDisabled();
      expect(screen.getByTestId('end-chat-button')).toBeDisabled();
      expect(screen.getByTestId('message-input')).toBeDisabled();
    });
  });

  test('renders reconnected banner when reconnect event is triggered', async () => {
    jest.useFakeTimers();
    
    // Mock the Genesys window object 
    window.Genesys = {};

    initialiseGenesysConversation.mockImplementation((onGenesysReady) => {
      onGenesysReady();
    });

    subscribeToGenesysMessages.mockImplementation((onMessagesReceived) => {
      onMessagesReceived([]);
    });

    subscribeToGenesysReconnected.mockImplementation((onReconnected) => {
      onReconnected();
    });

    renderGenesysChatComponent();

    act(() => {
      jest.advanceTimersByTime(10); // match the delay in the reconnected handler
    });

    const heading = screen.getByRole('heading');
    expect(heading).toHaveTextContent('Home Office ETA Chat');

    const subText = screen.getByText(/Ask our/i);
    expect(subText).toHaveTextContent('Ask our digital assistant about an ETA');

    expect(screen.getByRole('log')).toBeInTheDocument();

    const reconnectedBanner = screen.getByText(/You are now online/i);
    expect(reconnectedBanner).toBeInTheDocument();
    expect(reconnectedBanner).toHaveTextContent('You are now online. Messages can now be sent.');
  });
});

describe('Genesys Chat Component error handling', () => {

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('handles an error being returned from Genesys and displays correct content', async () => {
    subscribeToErrors.mockImplementation((onError) => {
      onError();
    });

    renderGenesysChatComponent();

    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('Something went wrong');

    const errorMessage = screen.getByText(/Please try again in a/i);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Please try again in a few minutes or use our contact form. We will reply in 3 to 5 working days.');
    expect(errorMessage.querySelector('a')).toHaveAttribute('href', 'http://localhost/example-error-link');
  });

  test('handles an error being returned from Genesys initialisation and displays correct content', async () => {
    initialiseGenesysConversation.mockImplementation((onGenesysReady, onError) => {
      onGenesysReady();
      onError();
    });

    renderGenesysChatComponent();

    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('Something went wrong');

    const errorMessage = screen.getByText(/Please try again in a/i);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Please try again in a few minutes or use our contact form. We will reply in 3 to 5 working days.');
    expect(errorMessage.querySelector('a')).toHaveAttribute('href', 'http://localhost/example-error-link');
  });

  test('renders error component if fetch history throws an error', async () => {
    // Mock the Genesys window object 
    window.Genesys = {};

    let errorCallback;

    initialiseGenesysConversation.mockImplementation((onGenesysReady) => {
      onGenesysReady();
    });

    subscribeToGenesysMessages.mockImplementation((onMessagesReceived) => {
      onMessagesReceived([]);
    });

    subscribeToSessionRestored.mockImplementation((onSessionRestored) => {
      onSessionRestored(largeSetRestoredMessages);
    });

    subscribeToGenesysOldMessages.mockImplementation((onFetchHistory, onHistoryComplete) => {
      onFetchHistoryCallback = onFetchHistory;
      onHistoryCompleteCallback = onHistoryComplete;
    });

    fetchMessageHistory.mockImplementation((onError) => {
      errorCallback = onError;
    });

    renderGenesysChatComponent();

    const loadMoreMessagesButton = screen.getByRole('button', { name: /Load more messages/i });
    expect(loadMoreMessagesButton).toBeInTheDocument();
    expect(loadMoreMessagesButton).toHaveTextContent('Load more messages');

    const user = userEvent.setup();
    await user.click(loadMoreMessagesButton);

    // Simulate error callback being triggered by the Genesys SDK
    act(() => {
      errorCallback();
    });

    // Error component should be rendered
    await waitFor(() => {
      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(1);
      expect(headings[0]).toHaveTextContent('Something went wrong');

      const errorMessage = screen.getByText(/Please try again in a/i);
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Please try again in a few minutes or use our contact form. We will reply in 3 to 5 working days.');
      expect(errorMessage.querySelector('a')).toHaveAttribute('href', 'http://localhost/example-error-link');
    });
  });
});

describe('Enable and disable Visibilty to structured message', () => {
  test('handles visibilty to true for previous messages', async () => {
    // Mock the Genesys window object 
    window.Genesys = {};
    let previousMessage;
    initialiseGenesysConversation.mockImplementation((onGenesysReady) => {
      onGenesysReady();
    });


    subscribeToGenesysMessages.mockImplementation((onMessagesReceived) => {
      onMessagesReceived([incomingMessage[0]]);
      previousMessage = setPreviousStructureHideTrue(withStructuredMessages);
    });

    renderGenesysChatComponent();

    expect(previousMessage[2].content.hideContent).toBe(true);
  });

  test('handles not to set visibilty to content', async () => {
    // Mock the Genesys window object 
    window.Genesys = {};
    let previousMessage;

    initialiseGenesysConversation.mockImplementation((onGenesysReady) => {
      onGenesysReady();
    });

    subscribeToGenesysMessages.mockImplementation((onMessagesReceived) => {
      onMessagesReceived([incomingMessage[0]]);
      previousMessage = setPreviousStructureHideTrue(largeSetRestoredMessages);
    });

    renderGenesysChatComponent();

    for (let count = 0; count >= previousMessage.length; count++) {
      expect(previousMessage[count].content).toBeUndefined();
    };
  });

  test('handles the last index for structured message ', async () => {
    // Mock the Genesys window object 
    window.Genesys = {};
    let previousMessage;
    let lastIndex;

    initialiseGenesysConversation.mockImplementation((onGenesysReady) => {
      onGenesysReady();
    });

    subscribeToGenesysMessages.mockImplementation((onMessagesReceived) => {
      onMessagesReceived([incomingMessage[0]]);
      previousMessage = setPreviousStructureHideTrue(withStructuredMessages);
      lastIndex = getStructureMessageIndex(previousMessage);
    });

    renderGenesysChatComponent();

    expect(lastIndex).toBe(2);
  });

  it('return -1 as the last index for structured message ', async () => {
    // Mock the Genesys window object 
    window.Genesys = {};
    let previousMessage;
    let lastIndex;

    initialiseGenesysConversation.mockImplementation((onGenesysReady) => {
      onGenesysReady();
    });

    subscribeToGenesysMessages.mockImplementation((onMessagesReceived) => {
      onMessagesReceived([incomingMessage[0]]);
      previousMessage = setPreviousStructureHideTrue(largeSetRestoredMessages);
      lastIndex = getStructureMessageIndex(previousMessage);
    });

    renderGenesysChatComponent();

    expect(lastIndex).toBe(-1);
  });
});
