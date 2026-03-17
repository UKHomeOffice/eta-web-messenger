import { logToService } from '../../../src/components/utils/logging';

describe('logToService', () => {
  const originalPathname = window.location.pathname;
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
  });

  afterEach(() => {
    global.fetch = originalFetch;
    window.history.replaceState({}, '', originalPathname);
    jest.clearAllMocks();
  });

  it('should send correct payload with default supportType (ETA)', async () => {
    window.location.pathname = '/random/path';
    await logToService('info', 'Test message');

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.service).toBe('ETA Web Messenger');
    expect(body.level).toBe('info');
    expect(body.message).toBe('Test message');
    expect(body).toHaveProperty('timestamp');
    expect(body).not.toHaveProperty('metadata');
  });

  it('should set supportType to EUSS if pathname includes "euss"', async () => {
    window.history.replaceState({}, '', '/euss/path');
    await logToService('warn', 'EUSS test');

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.service).toBe('EUSS Web Messenger');
  });

  it('should set supportType to eVisa if pathname includes "evisa"', async () => {
    window.history.replaceState({}, '', '/evisa/path');
    await logToService('error', 'eVisa test');

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.service).toBe('eVisa Web Messenger');
  });

  it('should include metadata if provided', async () => {
    window.history.replaceState({}, '', '/');
    const metadata = { id: 123, action: 'test' };
    await logToService('info', 'With metadata', metadata);

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.metadata).toEqual(metadata);
  });
});
