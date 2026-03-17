import { convertHtmlWithLinkText } from '../../../utils/text-converter';

export default function MessageText({ text, messageType, serviceName }) {       
  const html = convertHtmlWithLinkText(text, serviceName);    

  return (
    <p dangerouslySetInnerHTML={{ __html: html }} className={`${(messageType === 'Inbound') ?
      'inbound-message' : 'outbound-message'} govuk-body`} />
  );
}
