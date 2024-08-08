const validator = require("validator");

const validateURL = (value) => {
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  return urlRegex.test(value);
};

module.exports = {
  validateURL,
};
