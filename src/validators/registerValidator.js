const Joi = require("joi");

const registerValidator = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("attendee", "organizer").optional(),
});

module.exports = registerValidator;
