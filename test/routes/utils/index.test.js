import { 
  checkChatEnded,
  mapHistoricalMessagesToStandardMessageFormat,
  clearAgentTypingOnOutboundHumanMessage 
} from '../../../src/components/utils';

describe('route utils', () => {
  test('mapHistoricalMessagesToStandardMessageFormat maps single hisotrical message correctly', () => {
    const historicalMessage = [{
      'text': 'Welcome to the webchat, in few word how can i help you today?',
      'messageType': 'outbound',
      'type': 'text',
      'timestamp': '2025-07-31T09:39:00Z',
      'metadata': {
        'correlationId': '00000000-0000-0000-0000-000000000000'
      },
      'originatingEntity': 'Bot'
    }];

    const mappedMessages = mapHistoricalMessagesToStandardMessageFormat(historicalMessage);

    const expectedMessage = {
      direction: 'outbound',
      type: 'text',
      originatingEntity: 'Bot',
      channel: {
        time: '2025-07-31T09:39:00Z'
      },
      text: 'Welcome to the webchat, in few word how can i help you today?'
    };

    expect(mappedMessages).toHaveLength(1);
    expect(mappedMessages[0]).toEqual(expectedMessage);
  });

  test('mapHistoricalMessagesToStandardMessageFormat maps multiple hisotrical messages correctly', () => {
    const historicalMessage = [
      {
        'text': 'Welcome to the webchat, in few word how can i help you today?',
        'messageType': 'outbound',
        'type': 'text',
        'timestamp': '2025-07-31T09:39:00Z',
        'metadata': {
          'correlationId': '00000000-0000-0000-0000-000000000000'
        },
        'originatingEntity': 'Bot'
      },
      {
        'text': 'Hello, I need help with my application',
        'messageType': 'inbound',
        'type': 'text',
        'timestamp': '2025-07-31T09:39:15Z',
        'metadata': {
          'correlationId': '00000000-0000-0000-0000-000000000000'
        }
      },
    ];

    const mappedMessages = mapHistoricalMessagesToStandardMessageFormat(historicalMessage);

    const expectedOutboundMessage = {
      direction: 'outbound',
      type: 'text',
      originatingEntity: 'Bot',
      channel: {
        time: '2025-07-31T09:39:00Z'
      },
      text: 'Welcome to the webchat, in few word how can i help you today?'
    };

    expect(mappedMessages).toHaveLength(2);
    expect(mappedMessages[0]).toEqual(expectedOutboundMessage);
    // Need to check inbound messages specifically due to jests deep equal comparison
    expect(mappedMessages[1]).toHaveProperty('direction', 'inbound');
    expect(mappedMessages[1]).toHaveProperty('type', 'text');
    expect(mappedMessages[1]).toHaveProperty('channel.time', '2025-07-31T09:39:15Z');
    expect(mappedMessages[1]).toHaveProperty('text', 'Hello, I need help with my application');
  });

  test('clearAgentTypingOnOutboundHumanMessage executes callback when message is Outbound from Human', () => {
    const message = {
      direction: 'Outbound',
      originatingEntity: 'Human'
    };

    const setAgentIsTyping = jest.fn();
    clearAgentTypingOnOutboundHumanMessage(message, setAgentIsTyping);
    expect(setAgentIsTyping).toHaveBeenCalledTimes(1);
  });

  test('clearAgentTypingOnOutboundHumanMessage doesnt execute callback when message is Inbound', () => {
    const message = {
      direction: 'Inbound',
      originatingEntity: 'Bot'
    };

    const setAgentIsTyping = jest.fn();
    clearAgentTypingOnOutboundHumanMessage(message, setAgentIsTyping);
    expect(setAgentIsTyping).toHaveBeenCalledTimes(0);
  });

  describe('checkChatEnded', () => {
    afterEach(() => {
      // Reset the internal state between tests
      checkChatEnded([]);
    });

    test('returns true when chat ended event is present and chatHintPreviouslyShown is false', () => {
      const messages = [
        {
          originatingEntity: 'Human',
          direction: 'Outbound',
          events: [
            {
              eventType: 'Presence',
              presence: { type: 'Disconnect' }
            }
          ]
        }
      ];
      expect(checkChatEnded(messages)).toBe(true);
    });

    test('returns false when no chat ended event is present', () => {
      const messages = [
        {
          originatingEntity: 'Human',
          direction: 'Outbound',
          events: [
            {
              eventType: 'Presence',
              presence: { type: 'Connect' }
            }
          ]
        }
      ];
      expect(checkChatEnded(messages)).toBe(false);
    });

    test('returns false when messages array is empty', () => {
      expect(checkChatEnded([])).toBe(false);
    });

    test('resets chatHintPreviouslyShown when chat ended event disappears', () => {
      const endedMessages = [
        {
          originatingEntity: 'Human',
          direction: 'Outbound',
          events: [
            {
              eventType: 'Presence',
              presence: { type: 'Disconnect' }
            }
          ]
        }
      ];
      const nonEndedMessages = [
        {
          originatingEntity: 'Human',
          direction: 'Outbound',
          events: [
            {
              eventType: 'Presence',
              presence: { type: 'Connect' }
            }
          ]
        }
      ];
      checkChatEnded(endedMessages);
      expect(checkChatEnded(nonEndedMessages)).toBe(false);
      expect(checkChatEnded(endedMessages)).toBe(true);
    });

    test('returns false when message is not from Human', () => {
      const messages = [
        {
          originatingEntity: 'Bot',
          direction: 'Outbound',
          events: [
            {
              eventType: 'Presence',
              presence: { type: 'Disconnect' }
            }
          ]
        }
      ];
      expect(checkChatEnded(messages)).toBe(false);
    });

    test('returns false when direction is not Outbound', () => {
      const messages = [
        {
          originatingEntity: 'Human',
          direction: 'Inbound',
          events: [
            {
              eventType: 'Presence',
              presence: { type: 'Disconnect' }
            }
          ]
        }
      ];
      expect(checkChatEnded(messages)).toBe(false);
    });

    test('returns false when eventType is not Presence', () => {
      const messages = [
        {
          originatingEntity: 'Human',
          direction: 'Outbound',
          events: [
            {
              eventType: 'Other',
              presence: { type: 'Disconnect' }
            }
          ]
        }
      ];
      expect(checkChatEnded(messages)).toBe(false);
    });

    test('returns false when presence type is not Disconnect', () => {
      const messages = [
        {
          originatingEntity: 'Human',
          direction: 'Outbound',
          events: [
            {
              eventType: 'Presence',
              presence: { type: 'Connect' }
            }
          ]
        }
      ];
      expect(checkChatEnded(messages)).toBe(false);
    });
  });
});
