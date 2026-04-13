export default function UpdateCookiesForm({   
  useCookies, 
  setUseCookies, 
  handleSaveCookieSettings
}) {
  return (
    <form>
      <div className="govuk-form-group">
        <fieldset className="govuk-fieldset">
          <div className="govuk-radios" data-module="govuk-radios">
            <div className="govuk-radios__item">
              <input className="govuk-radios__input" 
                id="radio-cookies-accept" 
                name="analytics-cookies" type="radio" 
                value="yes" checked={useCookies} 
                onChange={() => setUseCookies(true)} 
              />
              <label className="govuk-label govuk-radios__label" htmlFor="radio-cookies-accept">
                Use cookies that measure my website use.
              </label>
            </div>
            <div className="govuk-radios__item">
              <input className="govuk-radios__input" 
                id="radio-cookies-reject" 
                name="analytics-cookies" 
                type="radio" 
                value="no" 
                checked={!useCookies} onChange={() => setUseCookies(false)} 
              />
              <label className="govuk-label govuk-radios__label" htmlFor="radio-cookies-reject">
                Do not use cookies that measure my website use.
              </label>
            </div>
          </div>
        </fieldset>
      </div>
      <button className="govuk-button" data-module="govuk-button" onClick={(event) => handleSaveCookieSettings(event)}>
        Save cookie settings
      </button>
    </form>
  );
}
