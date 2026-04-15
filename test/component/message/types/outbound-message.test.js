import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import OutboundTextMessage from '../../../../src/components/message/types/outbound-message';

const outboundMessages = require('../../../outbound-messages.json');
const structuredMessages = require('../../../structured-messages.json');

describe('OutboundTextMessage component', () => {
  test('renders OutboundTextMessage components with only text', () => {

    render(
      <OutboundTextMessage
        message={outboundMessages[0]}
        handleQuickReply={() => { }}
      />
    );

    const messages = screen.getAllByTestId('outbound-message');
    expect(messages).toHaveLength(1);
    expect(messages[0]).toHaveTextContent('Hello and welcome to the ETA webchat service. Please ask me a question relating to the ETA process. You\'re communicating with a computer. Please do not disclose any personal or sensitive information.');
    expect(messages[0]).toHaveTextContent('Digital assistant at 09:38');
  });

  test('renders OutboundTextMessage components as StructuredMessage', () => {

    render(
      <OutboundTextMessage
        message={structuredMessages[0]}
        handleQuickReply={() => { }}
      />
    );

    const messages = screen.getAllByTestId('outbound-message');
    expect(messages).toHaveLength(1);
    expect(messages[0]).toHaveTextContent('Did this answer your question?');
    expect(messages[0]).toHaveTextContent('Digital assistant at 09:39');
  });

  test.each([
    'eta'
  ])('renders OutboundTextMessage component with correct UTM parameters when text contains link', (serviceName) => {

    const message = {
      'direction': 'Outbound',
      'text': 'You can find more information on [the home page](http://example.com)',
      'type': 'Text',
      'channel': {
        'time': '2025-07-31T09:38:00Z'
      },
      'metadata': {
        'correlationId': '00000000-0000-0000-0000-000000000000'
      },
      'originatingEntity': 'Bot',
      'content': []
    };

    render(
      <OutboundTextMessage
        message={message}
        handleQuickReply={() => { }}
        serviceName={serviceName}
      />
    );

    const messages = screen.getAllByTestId('outbound-message');
    expect(messages).toHaveLength(1);
    expect(messages[0]).toHaveTextContent('You can find more information on the home page');
    
    // Check message has a correctly formated link with UTM parameters
    const link = screen.getByRole('link', { name: 'the home page' });
    expect(link).toHaveAttribute('href', `http://example.com?utm_source=webmessenger&utm_medium=internal_link&utm_campaign=${serviceName.toUpperCase()}_Internal_WebMessenger`);
  });
});
