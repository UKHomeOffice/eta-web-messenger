import MessageMetaData from '../message-meta';
import MessageText from '../message-text';
import { formatDate } from '../../../../utils/index';
import StructuredMessage from './structured-message';
const config = require('../../../../config');

export default function OutboundTextMessage({ 
  message, 
  handleQuickReply,
  serviceName
}) {
  const formattedTime = formatDate(message.channel.time);
  const metaDisplay = (message.hasOwnProperty('channel') &&
      message.channel.hasOwnProperty('from') &&
      message.channel.from.hasOwnProperty('nickname')) ?
    message.channel.from.nickname : config.botMetaDisplay;
  return (
    <div className='outbound-message-wrapper'
      role="article"
      aria-label="Outbound message"
      data-testid="outbound-message">

      <MessageText
        messageType='Outbound'
        text={message.text} 
        serviceName={serviceName}
      />

      <MessageMetaData
        metaDataType='Outbound'
        messageTimeStamp={formattedTime}
        metaDisplay={metaDisplay} />

      {
        message.type === 'Structured' &&
            !message.content.hideContent &&
            <StructuredMessage
              contents={message.content}
              handleQuickReply={handleQuickReply} />
      }
    </div>
  );
}
