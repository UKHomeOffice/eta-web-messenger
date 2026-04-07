import { marked } from 'marked';
import config from '../config';

const isTextContainsMarkDown = (text, offset) => {
  const before = text.slice(0, offset);
  return /\]\([^)]*$/.test(before);
};

export const convertToMarkdown = (text, serviceName) => {
  // Remove backslashes
  let markDown = text.replace(/\\/g, '')
    .replace(/\n/g, '  \n');

  // Convert email addresses → Markdown mailto links
  // Skip if already inside a Markdown link [..](mailto:..)
  markDown = markDown.replace(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    (email, offset, text) => {
      // check if immediately preceded by a "](" (means already in link)
      if (isTextContainsMarkDown(text, offset)) return email;
      return `[${email}](mailto:${email})`;
    }
  );

  // Convert URLs → Markdown links
  // Skip if already inside a Markdown link [..](http..)
  markDown = markDown.replace(
    /\b(https?:\/\/[^\s)]+)\b/g,
    (url, _, offset, text) => {
      if (isTextContainsMarkDown(text, offset)) {
        url += getUtmParametersByServiceName(serviceName);
        return url; // already inside a link
      }
      return `[${url}](${url}${getUtmParametersByServiceName(serviceName)})`;
    }
  );

  return markDown;
};


export const convertHtmlWithLinkText = (text, serviceName) => {
  const markDown = convertToMarkdown(text, serviceName);

  const renderer = {
    link({ href, title, text }) {
      const isEmail = href.startsWith('mailto:');
      const className = isEmail ? 'govuk-link govuk-link--email' : 'govuk-link';
      const titleAttr = title ? ` title="${title}"` : '';
      const targetAttr = isEmail ? '' : ' target="_blank" rel="noopener noreferrer"';
      return `<a class="${className}" ${titleAttr}${targetAttr} href="${href}">${text}</a>`;
    }
  };

  marked.use({
    pedantic: false,
    gfm: true,
    breaks: false,
    renderer
  });

  // Convert markdown to HTML string with custom renderer
  return marked.parse(markDown).replace(/<\/?p>/g, '').trim();

};

/**
 * Get the right UTM param based on the service name. This name can never not be present,
 * so we don't default to an error.
 * @param {string} the name of the service (eta)
 * @returns {string} the UTM param for the service
 */
function getUtmParametersByServiceName(serviceName) {
  switch (serviceName) {
    default:
      return config.eta.gaUtmParam;
  }
}
