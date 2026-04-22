import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import RootLayout from '../../../src/components/layout/layout';
import { initialiseGoogleTagManager } from '../../../src/google-analytics/google-analytics';
import { getEnvValueByKey } from '../../../src/env-bootstrap';

jest.mock('../../../src/components/layout/header/header', () => () => <div data-testid="header">Header</div>);
jest.mock('../../../src/components/layout/banner/phase-banner', () => () => <div data-testid="phase-banner">Phase banner</div>);
jest.mock('../../../src/components/layout/footer/footer', () => () => <div data-testid="footer">Footer</div>);
jest.mock('../../../src/components/cookies/cookie-banner', () => () => <div data-testid="cookie-banner">Cookie banner</div>);
jest.mock('../../../src/components/cookies/cookie-banner-visibility-provider', () => ({
	CookieBannerVisibilityProvider: ({ children }) => <>{children}</>
}));

jest.mock('../../../src/google-analytics/google-analytics', () => ({
	initialiseGoogleTagManager: jest.fn()
}));

jest.mock('../../../src/env-bootstrap', () => ({
	getEnvValueByKey: jest.fn()
}));

jest.mock('../../../config', () => ({
	__esModule: true,
	default: {
		service: {
			cookiePolicy: 'eta_cookie_policy'
		}
	}
}));

describe('RootLayout', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		document.body.classList.remove('govuk-template__body');
	});

	test('renders the layout sections and children', () => {
		getEnvValueByKey.mockReturnValue(false);

		render(
			<RootLayout>
				<div data-testid="child-content">Child content</div>
			</RootLayout>
		);

		expect(screen.getByTestId('cookie-banner')).toBeInTheDocument();
		expect(screen.getByTestId('header')).toBeInTheDocument();
		expect(screen.getByTestId('phase-banner')).toBeInTheDocument();
		expect(screen.getByTestId('footer')).toBeInTheDocument();
		expect(screen.getByTestId('child-content')).toBeInTheDocument();
	});

	test('adds the govuk body class on render', () => {
		getEnvValueByKey.mockReturnValue(false);

		render(
			<RootLayout>
				<div>Content</div>
			</RootLayout>
		);

		expect(document.body).toHaveClass('govuk-template__body');
	});

	test('initialises google tag manager when analytics is enabled', () => {
		getEnvValueByKey.mockImplementation((key) => {
			if (key === 'ENABLE_ANALYTICS') {
				return true;
			}
			if (key === 'GOOGLE_TAG_MANAGER_ID') {
				return 'GTM-TEST-ID';
			}
			return undefined;
		});

		render(
			<RootLayout>
				<div>Content</div>
			</RootLayout>
		);

		expect(initialiseGoogleTagManager).toHaveBeenCalledWith('GTM-TEST-ID', 'eta_cookie_policy');
	});

	test('does not initialise google tag manager when analytics is disabled', () => {
		getEnvValueByKey.mockImplementation((key) => {
			if (key === 'ENABLE_ANALYTICS') {
				return false;
			}
			if (key === 'GOOGLE_TAG_MANAGER_ID') {
				return 'GTM-TEST-ID';
			}
			return undefined;
		});

		render(
			<RootLayout>
				<div>Content</div>
			</RootLayout>
		);

		expect(initialiseGoogleTagManager).not.toHaveBeenCalled();
	});
});
