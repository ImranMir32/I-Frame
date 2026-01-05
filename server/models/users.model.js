const Joi = require("joi");

const userModel = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "admin").default("user"),
  savedPhotos: Joi.array().items(Joi.string()).default([]),
});

module.exports = userModel;