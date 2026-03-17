import { getCharacterCount, isTextOffset } from '../../../utils/text-counter';
const config = require('../../../config');

export default function CharacterCounter({ textLength }) {
  const offSetText = getCharacterCount(config.maxCharacterLimit, textLength);
  const remainText = getCharacterCount(textLength, config.maxCharacterLimit);
  const isMaxLength = isTextOffset(offSetText);

  return (
    <div className={`${isMaxLength ? 'max-length-message' : null}`}
      role="article"
      aria-label="Character counter"
      data-testid="character-counter">
      {
        isMaxLength &&
        <p className='govuk-body'>
          {offSetText} characters over
        </p>
      }
      {
        (remainText <= 200 && !isMaxLength) &&
        <p className='govuk-body'>
          {remainText} characters left
        </p>
      }
    </div >
  );
};
