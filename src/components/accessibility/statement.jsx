import PreparationStatementSection from './preparation-date-section';
import ReportingSection from './reporting-section';
import EnforcementProcedureSection from './enforcement-section';
import ComplianceStatusSection from './compliance-section';
import TechnicalInformationSection from './technical-information-section';

export default function AccessibilityStatement() {
  return (
    <>
      <h1 className="govuk-heading-xl">
        Accessibility statement for ask about electronic travel authorisation (ETA)
      </h1>

      <p className="govuk-body">
        This service is run by the Home Office. We want as many people as possible to be able to use this service.
        For example, that means you should be able to:
      </p>
      <ul className='govuk-list govuk-list--bullet govuk-list--spaced'>
        <li>
          change colours, contrast levels and fonts
        </li>
        <li>
          zoom in up to 400% without the text spilling off the screen
        </li>
        <li>
          navigate most of the service using just a keyboard
        </li>
        <li>
          navigate most of the service using speech recognition software
        </li>
        <li>
          listen to most of the service using a screen reader
          (including the most recent versions of JAWS, NVDA and VoiceOver)
        </li>
        <li>
          move focus from the launcher to the messenger window
        </li>
        <li>
          close or minimise the messenger and return focus correctly
        </li>
        <li>
          navigate the message stream and input controls in a logical order
        </li>
        <li>
          see a visible focus indicator when using a keyboard
        </li>
        <li>
          receive screen reader announcements for new messages, status updates,
          send confirmations and error confirmations
        </li>
        <li>
          use the messenger at 400% zoom without the widget becoming unusable or blocking access to the page
        </li>
      </ul>

      <p className="govuk-body">
        We've also made the service text as simple as possible to understand. <a href='https://mcmw.abilitynet.org.uk/'>
          AbilityNet Simple 'how to' guides to make your device easier to use My Computer My Way
        </a>
      </p>

      <ReportingSection />
      <EnforcementProcedureSection />
      <TechnicalInformationSection />
      <ComplianceStatusSection />
      <PreparationStatementSection />
    </>
  );
}
