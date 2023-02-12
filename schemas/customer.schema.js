const Joi = require("joi");

const id = Joi.number().integer();
const name = Joi.string();
const phone = Joi.string();


const createCustomerSchema = Joi.object({
  id: id.required(),
  name: name.required(),
  phone: phone.required()
});

const updateCustomerSchema = Joi.object({
  id: id,
  name: name,
  phone: phone,
});

const getCustomerSchema = Joi.object({
  id: id.required()
});

module.exports = { createCustomerSchema, updateCustomerSchema, getCustomerSchema };
