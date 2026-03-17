import { formatDate, stringsAreEqualIgnoringCase } from '../../utils/index';

describe('utils', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('formatDate should return a given date formatted as HH:MM in en-GB locale', () => {
    const dateToFormat = new Date('2023-07-25T18:30:00Z'); // 18:30 UTC
    const actualDate = formatDate(dateToFormat);

    const expectedDate = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateToFormat);

    expect(actualDate).toBe(expectedDate);
  });

  test('stringsAreEqualIgnoringCase should return true for 2 strings that are equal', () => {
    const stringOne = 'Inbound';
    const stringTwo = 'inbound';

    expect(stringsAreEqualIgnoringCase(stringOne, stringTwo)).toBeTruthy();
  });

  test('stringsAreEqualIgnoringCase should return false for 2 strings that are not equal', () => {
    const stringOne = 'Inbound';
    const stringTwo = 'Outbound';

    expect(stringsAreEqualIgnoringCase(stringOne, stringTwo)).toBeFalsy();
  });
});
