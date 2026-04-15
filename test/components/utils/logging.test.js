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

  it('should include metadata if provided', async () => {
    window.history.replaceState({}, '', '/');
    const metadata = { id: 123, action: 'test' };
    await logToService('info', 'With metadata', metadata);

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.metadata).toEqual(metadata);
  });
});
