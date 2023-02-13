const Joi = require("joi");

const id = Joi.number().integer();
const customerId = Joi.number().integer();
const status = Joi.string();
const comments = Joi.string();


const createOrderSchema = Joi.object({
    customerId: customerId.required(),
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

module.exports = { createOrderSchema, getOrderSchema, updateOrderSchema }
