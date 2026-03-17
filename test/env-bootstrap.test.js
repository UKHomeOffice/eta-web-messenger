import { loadEnvironmentConfig, getEnvValueByKey } from '../src/env-bootstrap';

describe('env-bootstrap', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should load environment config and call onSuccess', async () => {
    const mockConfig = { API_URL: 'http://localhost', KEY: 'value' };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockConfig),
    });

    const onSuccess = jest.fn();
    await loadEnvironmentConfig(onSuccess);

    expect(getEnvValueByKey('API_URL')).toBe('http://localhost');
    expect(getEnvValueByKey('KEY')).toBe('value');
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should throw error if fetch response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: jest.fn(),
    });

    await expect(loadEnvironmentConfig()).rejects.toThrow('Failed to load environment config');
  });

  it('should return undefined for unknown key', async () => {
    const mockConfig = { SOME_KEY: 'some_value' };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockConfig),
    });

    await loadEnvironmentConfig();
    expect(getEnvValueByKey('UNKNOWN_KEY')).toBeUndefined();
  });

  it('should not fail if onSuccess is not provided', async () => {
    const mockConfig = { TEST: 'test' };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockConfig),
    });

    await expect(loadEnvironmentConfig()).resolves.not.toThrow();
    expect(getEnvValueByKey('TEST')).toBe('test');
  });
});
