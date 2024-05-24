const Joi = require("joi");

const eventValidator = Joi.object({
  title: Joi.string().required(),
  date: Joi.date().iso().required(),
  time: Joi.string().required(),
  description: Joi.string().required(),
});

module.exports = eventValidator;
