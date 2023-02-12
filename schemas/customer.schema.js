const Joi = require("joi");
const {createUserSchema, updateUserSchema} = require("./user.schema")

const id = Joi.number().integer();
const name = Joi.string();
const phone = Joi.string();


const createCustomerSchema = Joi.object({
  name: name.required(),
  phone: phone.required(),
  user: createUserSchema
});

const updateCustomerSchema = Joi.object({
  name: name,
  phone: phone,
  user: updateUserSchema
});

const getCustomerSchema = Joi.object({
  id: id.required()
});

module.exports = { createCustomerSchema, updateCustomerSchema, getCustomerSchema };
