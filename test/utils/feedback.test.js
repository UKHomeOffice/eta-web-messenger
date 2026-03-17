import { getFeedbackUrl } from '../../utils/feedback';

const config = require('../../config');


describe('getFeedbackUrl', () => {
  const environmentUrls = config.feedback;

  it('returns ETA URL when serviceUrl is "/eta"', () => {
    const actual = getFeedbackUrl('/eta');
    expect(actual).toBe(environmentUrls.eta);
  });

  it('returns EVISA URL when serviceUrl is "/evisa"', () => {
    const actual = getFeedbackUrl('/evisa');
    expect(actual).toBe(environmentUrls.evisa);
  });

  it('returns EUSS URL when serviceUrl is "/euss"', () => {
    const actual = getFeedbackUrl('/euss');
    expect(actual).toBe(environmentUrls.euss);
  });

  it('render a blank link # URL when serviceUrl is anything else', () => {
    const actual = getFeedbackUrl('/other');
    expect(actual).toBe('#');
  });
});
