const Joi = require("joi");

const id = Joi.number().integer();
const name = Joi.string().min(3).max(15);
const price = Joi.number().integer();
//const image = Joi.string().uri();
//const isBlock = Joi.boolean();

const createProductSchema = Joi.object({
  name: name.required(),
  price: price.required(),
  //image: image.required(),
  //isBlock: isBlock.required()
});

const updateProductSchema = Joi.object({
  id: id,
  name: name,
  price: price,
  //image: image,
  //isBlock: isBlock
});

const getProductSchema = Joi.object({
  id: id.required(),
});

module.exports = { createProductSchema, updateProductSchema, getProductSchema }
