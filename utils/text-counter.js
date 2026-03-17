const getCharacterCount = (maxLength, actualLength) => {
  if (actualLength > maxLength)
    return actualLength - maxLength;
  return 0;
};

const isTextOffset = (textLength) => {
  if (textLength === 0)
    return false;
  return true;
};

module.exports = {
  isTextOffset,
  getCharacterCount
};
