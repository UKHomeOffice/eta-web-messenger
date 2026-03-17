import { useLocation } from 'react-router';

export default function EndChatConfirmation() {

  const location = useLocation();
  const serviceName = location.state?.serviceName;

  return (
    <div>
      <h1 className="govuk-heading-l">Your chat has ended</h1>
      <p className="govuk-body">
        You can <a href={`/${serviceName}`} className="govuk-link" data-testid="new-chat-link">start a new chat</a>.
      </p>
    </div>
  );
}
