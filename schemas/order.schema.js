const Joi = require("joi");

const id = Joi.number().integer();
const customerId = Joi.number().integer();
const status = Joi.string();
const comments = Joi.string();

const productId = Joi.number().integer();
const productAmount = Joi.number().integer().min(1);

const createOrderSchema = Joi.object({
    customerId: customerId,
    status: status.required(),
    comments: comments
});

const updateOrderSchema = Joi.object({
    customerId: customerId,
    status: status,
    comments: comments
});

const getOrderSchema = Joi.object({
  id: id.required(),
});

const addItemSchema = Joi.object({
  productId: productId.required(),
  productAmount: productAmount.required()
})

module.exports = { createOrderSchema, getOrderSchema, updateOrderSchema, addItemSchema }
