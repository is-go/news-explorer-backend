const { Joi, celebrate } = require("celebrate");
const { validateURL } = require("../utils/validator");

module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    username: Joi.string().required().min(1).max(30).messages({
      "string.min": 'The minimum length of the "username" field is 1',
      "string.max": 'The maximum length of the "username" field is 30',
      "string.empty": 'The "username" field must be filled in',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().min(1).max(30).messages({
      "string.empty": 'The "password" field must be filled in',
      "string.min": 'The minimum length of the "password" field is 1',
      "string.max": 'The maximum length of the "password" field is 30',
    }),
  }),
});

module.exports.validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateArticleBody = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().messages({
      "string.empty": 'The "keyword" field must be filled in',
    }),
    title: Joi.string().required().messages({
      "string.empty": 'The "title" field must be filled in',
    }),
    text: Joi.string().required().messages({
      "string.empty": 'The "text" field must be filled in',
    }),
    date: Joi.date().required().messages({
      "date.base": 'The "date" field must be a valid date',
      "any.required": 'The "date" field is required',
    }),
    source: Joi.string().required().messages({
      "string.empty": 'The "source" field must be filled in',
    }),
    link: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "link" field must be filled in',
      "string.uri": 'The "link" field must be a valid URL',
    }),
    image: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "image" field must be filled in',
      "string.uri": 'The "image" field must be a valid URL',
    }),
  }),
});

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().required().hex().length(24).messages({
      "string.empty": 'The "articleId" field must be filled in',
      "string.hex": 'The "articleId" field must be a valid hex string',
      "string.length": 'The "articleId" field must be 24 characters long',
    }),
  }),
});
