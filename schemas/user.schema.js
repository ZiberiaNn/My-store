const Joi = require("joi");

const id = Joi.number().integer();
const email = Joi.string().email();
const password = Joi.string().min(8);


const createUserSchema = Joi.object({
  id: id.required(),
  email: email.required(),
  password: password.required()
});

const updateUserSchema = Joi.object({
  id: id,
  email: email,
  password: password
});

const getUserSchema = Joi.object({
  id: id.required()
});

module.exports = { createUserSchema, updateUserSchema, getUserSchema };
