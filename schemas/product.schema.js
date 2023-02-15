const Joi = require("joi");

const id = Joi.number().integer();
const name = Joi.string().min(3).max(15);
const price = Joi.number().integer();
const categoryId = Joi.number().integer();

const limit = Joi.number().integer();
const offset = Joi.number().integer();


const createProductSchema = Joi.object({
  name: name.required(),
  price: price.required(),
  categoryId: categoryId
});

const updateProductSchema = Joi.object({
  id: id,
  name: name,
  price: price,
  categoryId: categoryId,
});

const getProductSchema = Joi.object({
  id: id.required(),
});

const queryProductSchema = Joi.object({
  limit,
  offset
});

module.exports = { createProductSchema, updateProductSchema, getProductSchema, queryProductSchema }
