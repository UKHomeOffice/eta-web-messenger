import logData, { logToService } from '../../src/utils/logging';

jest.mock('../../config', () => ({
	__esModule: true,
	default: {
		logApiEndpoint: 'https://example.test/logs',
		service: {
			name: 'ETA'
		}
	}
}));

describe('logging utils', () => {
	const originalNodeEnv = process.env.NODE_ENV;
	const originalFetch = global.fetch;
	const originalConsoleLog = console.log;

	beforeEach(() => {
		jest.clearAllMocks();
		global.fetch = jest.fn().mockResolvedValue({ ok: true });
		console.log = jest.fn();
	});

	afterAll(() => {
		process.env.NODE_ENV = originalNodeEnv;
		global.fetch = originalFetch;
		console.log = originalConsoleLog;
	});

	test('logData logs to console in non-production environments', async () => {
		process.env.NODE_ENV = 'test';

		await logData({
			level: 'info',
			message: 'Non-production message',
			metadata: { source: 'unit-test' }
		});

		expect(console.log).toHaveBeenCalledWith('Non-production message');
		expect(global.fetch).not.toHaveBeenCalled();
	});

	test('logData sends logs to service in production', async () => {
		process.env.NODE_ENV = 'production';
		const isoDate = '2026-04-21T10:00:00.000Z';
		const toISOStringSpy = jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(isoDate);

		await logData({
			level: 'error',
			message: 'Production error message',
			metadata: { requestId: 'abc-123' }
		});

		expect(global.fetch).toHaveBeenCalledWith('https://example.test/logs', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				timestamp: isoDate,
				service: 'ETA',
				level: 'error',
				message: 'Production error message',
				metadata: { requestId: 'abc-123' }
			})
		});

		toISOStringSpy.mockRestore();
	});

	test('logToService omits metadata when not provided', async () => {
		const isoDate = '2026-04-21T10:05:00.000Z';
		const toISOStringSpy = jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(isoDate);

		await logToService('warn', 'No metadata message');

		expect(global.fetch).toHaveBeenCalledWith('https://example.test/logs', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				timestamp: isoDate,
				service: 'ETA',
				level: 'warn',
				message: 'No metadata message'
			})
		});

		toISOStringSpy.mockRestore();
	});
});
