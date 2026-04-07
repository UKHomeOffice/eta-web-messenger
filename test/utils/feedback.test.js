import { getFeedbackUrl } from '../../utils/feedback';

const config = require('../../config');


describe('getFeedbackUrl', () => {
  const environmentUrls = config.feedback;

  it('returns ETA URL when serviceUrl is "/eta"', () => {
    const actual = getFeedbackUrl('/eta');
    expect(actual).toBe(environmentUrls.eta);
  });

  it('render a blank link # URL when serviceUrl is anything else', () => {
    const actual = getFeedbackUrl('/other');
    expect(actual).toBe('#');
  });
});
