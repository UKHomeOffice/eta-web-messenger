import {
  convertToMarkdown,
  convertHtmlWithLinkText
} from '../../utils/text-converter';

describe('convertToMarkdown', () => {
  test('removes backslashes', () => {
    const input = 'This has a backslash \\ here.';
    const result = convertToMarkdown(input, 'eta');
    expect(result).toBe('This has a backslash  here.');
  });

  test('converts email addresses to mailto links', () => {
    const input = 'Contact me at test@example.com.';
    const result = convertToMarkdown(input, 'eta');
    expect(result).toBe('Contact me at [test@example.com](mailto:test@example.com).');
  });

  test('converts URLs to markdown links', () => {
    const input = 'Check this site https://example.com for details.';
    const result = convertToMarkdown(input, 'eta');
    expect(result).toEqual(expect.stringContaining('Check this site [https://example.com](https://example.com?utm_source=webmessenger&utm_medium=internal_link&utm_campaign=ETA_Internal_WebMessenger)'));
  });

  test('handles mixed input (backslashes, emails, and URLs)', () => {
    const input = 'Reach me at support\\@example.com or visit https://example.com/\\docs.';
    const result = convertToMarkdown(input, 'eta');
    expect(result).toContain(
      'Reach me at [support@example.com](mailto:support@example.com) or visit [https://example.com/docs](https://example.com/docs?utm_source=webmessenger&utm_medium=internal_link&utm_campaign=ETA_Internal_WebMessenger).'
    );
  });

  test('returns the same string if no replacements are needed', () => {
    const input = 'Just plain text with nothing special.';
    const result = convertToMarkdown(input, 'eta');
    expect(result).toBe(input);
  });

  test.each([
    'eta',
    'euss',
    'evisa'
  ])('adds %s utm param to URLs when service is %s', (serviceName) => {
    const input = 'Visit https://example.com for more info';
    const result = convertToMarkdown(input, serviceName);
    expect(result).toEqual(expect.stringContaining(`https://example.com?utm_source=webmessenger&utm_medium=internal_link&utm_campaign=${serviceName.toUpperCase()}_Internal_WebMessenger`));
  });
});

describe('convertHtmlWithLinkText', () => {

  test('renders email links with govuk-link--email class', () => {
    const input = 'Contact me at test@example.com';
    const result = convertHtmlWithLinkText(input, 'eta');

    const actual = result.match(/<a .*?>.*?<\/a>/)[0];

    expect(actual).toContain(
      '<a class="govuk-link govuk-link--email"  href="mailto:test@example.com">test@example.com</a>'
    );
  });

  test('renders URL links with govuk-link class and target/_blank', () => {
    const input = 'Visit https://example.com for more info';
    const result = convertHtmlWithLinkText(input, 'eta');
    const actual = result.match(/<a .*?>.*?<\/a>/)[0];
    expect(actual).toContain(
      '<a class="govuk-link"  target="_blank" rel="noopener noreferrer" href="https://example.com?utm_source=webmessenger&utm_medium=internal_link&utm_campaign=ETA_Internal_WebMessenger">https://example.com</a>'
    );
  });

  test('includes title attribute when provided', () => {
    const input = '[Example](https://example.com "Example Site")';
    const result = convertHtmlWithLinkText(input, 'eta');
    const actual = result.match(/<a .*?>.*?<\/a>/)[0];
    expect(actual).toContain(
      '<a class="govuk-link"  title="Example Site" target="_blank" rel="noopener noreferrer" href="https://example.com?utm_source=webmessenger&utm_medium=internal_link&utm_campaign=ETA_Internal_WebMessenger">Example</a>'
    );
  });

  test('removes backslashes from input', () => {
    const input = 'Visit https://example.com/\\docs';
    const result = convertHtmlWithLinkText(input, 'eta');
    const actual = result.match(/<a .*?>.*?<\/a>/)[0];
    expect(actual).toContain(
      '<a class="govuk-link"  target="_blank" rel="noopener noreferrer" href="https://example.com/docs?utm_source=webmessenger&utm_medium=internal_link&utm_campaign=ETA_Internal_WebMessenger">https://example.com/docs</a>'
    );
  });

  test('leaves plain text unchanged (no <p> tags)', () => {
    const input = 'Just some text without links.';
    const actual = convertHtmlWithLinkText(input, 'eta');

    expect(actual).toBe('Just some text without links.');
  });

  test.each([
    'eta',
    'euss',
    'evisa'
  ])('renders URL links with correct utm parameters for %s service', (serviceName) => {
    const input = 'Visit https://example.com for more info';
    const result = convertHtmlWithLinkText(input, serviceName);
    const actual = result.match(/<a .*?>.*?<\/a>/)[0];
    expect(actual).toContain(
      `<a class="govuk-link"  target="_blank" rel="noopener noreferrer" href="https://example.com?utm_source=webmessenger&utm_medium=internal_link&utm_campaign=${serviceName.toUpperCase()}_Internal_WebMessenger">https://example.com</a>`
    );
  });
});

