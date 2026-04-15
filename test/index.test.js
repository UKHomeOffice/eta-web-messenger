jest.mock('../src/env-bootstrap', () => ({
  loadEnvironmentConfig: jest.fn((onSuccess) => {
    if (onSuccess) onSuccess();
  }),
  getEnvValueByKey: jest.fn(() => {}),
}));

describe('document.title logic in index.js', () => {

  beforeEach(() => {
    // Reset module cache to ensure fresh execution
    jest.resetModules();
    document.body.innerHTML = '<div id="app"></div>';
  });

  const originalTitle = document.title;
  const originalPathname = window.location.pathname;

  afterEach(() => {
    document.title = originalTitle;
    window.history.replaceState({}, '', originalPathname);
    jest.clearAllMocks();
  });

  test('sets title to "Webchat: UK ETA support - GOV.UK" if pathname includes "eta"', () => {
    window.history.replaceState({}, '', '/eta/path');
    require('../src/index');
    expect(document.title).toBe('Webchat: UK ETA support - GOV.UK');
  });

  test('sets title to "Web Messenger" if pathname does not match any keyword', () => {
    window.history.replaceState({}, '', '/random/path');
    require('../src/index');
    expect(document.title).toBe('Webchat: UK ETA support - GOV.UK');
  });
});
