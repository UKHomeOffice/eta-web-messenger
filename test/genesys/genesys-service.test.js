import { 
  _test_registerForSessionClearingEvents as registerForSessionClearingEvents 
} from '../../src/genesys/genesys-service.js';

describe('registerForSessionClearingEvents', () => {
  let subscribers = {};

  beforeEach(() => {
    // Reset localStorage and subscribers before each test
    localStorage.clear();
    subscribers = {};

    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));

    // Mock window.Genesys and simulate a pub/sub flow from the Genesys side
    window.Genesys = jest.fn((action, event, callback) => {
      if (action === 'subscribe') {
        subscribers[event] = callback;
      } else if (action === 'publish') {
        const handler = subscribers[event];
        if (subscribers[event]) {
          handler();
        }
      }
    });
  });

  test('should remove localStorage item when sessionCleared is published', () => {
    localStorage.setItem('mySessionKey', 'someValue');

    registerForSessionClearingEvents('mySessionKey');

    // Simulate event
    window.Genesys('publish', 'MessagingService.sessionCleared');

    expect(localStorage.getItem('mySessionKey')).toBeNull();
  });

  test('should remove localStorage item when conversationReset is published', () => {
    localStorage.setItem('mySessionKey', 'someValue');

    registerForSessionClearingEvents('mySessionKey');

    window.Genesys('publish', 'MessagingService.conversationReset');

    expect(localStorage.getItem('mySessionKey')).toBeNull();
  });

  test('should remove localStorage item when conversationCleared is published', () => {
    localStorage.setItem('mySessionKey', 'someValue');

    registerForSessionClearingEvents('mySessionKey');

    window.Genesys('publish', 'MessagingService.conversationCleared');

    expect(localStorage.getItem('mySessionKey')).toBeNull();
  });
});
