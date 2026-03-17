import {
  getCurrentAgentName,
  setAgentConnectedBanner
} from '../../utils/genesys-agent';

import message from '../messages-with-agent.json';
import historicalMessage from '../restored-messages.json';
import outboundMessages from '../outbound-messages.json';

jest.mock('../../config.js', () => {
  const originalModule = jest.requireActual('../../config.js');
  return {
    ...originalModule,
    bannerTypeDisplay: {
      human: 'You now connected'
    }
  };
});

describe('GeneSys Agent', () => {
  test(' setAgentConnectedBanner should not add agent if it exist', () => {

    const expected = message.messages.length;
    const actual = setAgentConnectedBanner(message.messages);

    expect(actual.length).toBeGreaterThanOrEqual(expected);
    expect(actual.length).toBe(expected);
  });


  test(' setAgentConnectedBanner should add agent if not exist', () => {

    const expected = historicalMessage.messages.length;
    const actual = setAgentConnectedBanner(historicalMessage.messages);

    expect(actual.length).toBeGreaterThan(expected);
    expect(actual.length).not.toBe(expected);
  });

  test('getCurrentAgentName should return Agent name', () => {

    const expected = 'Chris';
    const actual = getCurrentAgentName(outboundMessages[5]);

    expect(actual).toBe(expected);
  });

  test('getCurrentAgentName should return undefined', () => {

    const expected = undefined;
    const actual = getCurrentAgentName(outboundMessages[3]);
    expect(actual).toBe(expected);
  });
});
