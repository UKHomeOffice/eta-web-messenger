import Cookies from 'js-cookie';
import { initialiseGoogleTagManager, removeGoogleAnalyticsCookies } from '../../src/google-analytics/google-analytics';

describe('Google Analytics', () => {
  let createElementSpy, appendChildSpy, getElementByIdSpy, removeSpy;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock document methods
    createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      return { id: '', innerHTML: '', async: false, src: '', remove: jest.fn() };
    });
    appendChildSpy = jest.spyOn(document.head, 'appendChild').mockImplementation(() => { });
    getElementByIdSpy = jest.spyOn(document, 'getElementById').mockImplementation(() => null);
    removeSpy = jest.fn();

    // Mock js-cookie
    jest.spyOn(Cookies, 'get').mockImplementation(() => ({}));
    jest.spyOn(Cookies, 'remove').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initialiseGoogleTagManager', () => {
    test('should add GTM script if consent is true', () => {
      Cookies.get.mockReturnValue('true');
      initialiseGoogleTagManager('GTM-XXXX', 'cookiePolicy');
      expect(createElementSpy).toHaveBeenCalledWith('script');
      expect(appendChildSpy).toHaveBeenCalled();
    });

    test('should not add GTM script if consent is not true', () => {
      Cookies.get.mockReturnValue('false');
      initialiseGoogleTagManager('GTM-XXXX', 'cookiePolicy');
      expect(createElementSpy).not.toHaveBeenCalledWith('script');
      expect(appendChildSpy).not.toHaveBeenCalled();
    });

    test('should remove GTM script if present and consent is not true', () => {
      Cookies.get.mockReturnValue('false');
      getElementByIdSpy.mockReturnValue({ remove: removeSpy });
      initialiseGoogleTagManager('GTM-XXXX', 'cookiePolicy');
      expect(getElementByIdSpy).toHaveBeenCalledWith('gtm-script');
      expect(removeSpy).toHaveBeenCalled();
    });
  });

  describe('removeGoogleAnalyticsCookies', () => {
    test('should remove _ga cookies', () => {
      Cookies.get.mockReturnValue({
        _ga: 'value1',
        _ga_12345: 'value2',
        other: 'value3'
      });
      removeGoogleAnalyticsCookies();
      expect(Cookies.remove).toHaveBeenCalledWith('_ga');
      expect(Cookies.remove).toHaveBeenCalledWith('_ga_12345');
      expect(Cookies.remove).not.toHaveBeenCalledWith('other');
    });

    test('should not remove cookies if none start with _ga', () => {
      Cookies.get.mockReturnValue({
        session: 'abc',
        test: 'def'
      });
      removeGoogleAnalyticsCookies();
      expect(Cookies.remove).not.toHaveBeenCalled();
    });
  });
});
