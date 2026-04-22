jest.mock('../src/env-bootstrap', () => ({
  loadEnvironmentConfig: jest.fn((onSuccess) => {
    if (onSuccess) onSuccess();
  }),
  getEnvValueByKey: jest.fn(() => {}),
}));

describe('index bootstrap logic', () => {

  beforeEach(() => {
    jest.resetModules();
    document.body.innerHTML = '<div id="app"></div>';
  });

  const originalTitle = document.title;
  const originalPathname = globalThis.location.pathname;

  afterEach(() => {
    document.title = originalTitle;
    globalThis.history.replaceState({}, '', originalPathname);
    jest.clearAllMocks();
  });

  test('sets title to "Webchat: UK ETA support - GOV.UK" on bootstrap', () => {
    require('../src/index');
    expect(document.title).toBe('Webchat: UK ETA support - GOV.UK');
  });

  test('sets the same title regardless of pathname', () => {
    globalThis.history.replaceState({}, '', '/random/path');
    require('../src/index');
    expect(document.title).toBe('Webchat: UK ETA support - GOV.UK');
  });
});
