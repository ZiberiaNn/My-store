const express = require("express");
const OrderService = require("../services/order.service");
const validatorHandler = require("../middlewares/validator.handler");
const { createOrderSchema, updateOrderSchema, getOrderSchema, addItemSchema } = require("../schemas/order.schema");


const router = express.Router();
const service = new OrderService();

router.get("/", async (req, res) => {
  const orders = await service.find();
  res.status(200).json(orders);
});


router.get("/:id",
  validatorHandler(getOrderSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await service.findOne(id);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  });

router.post("/",
  validatorHandler(createOrderSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newOrder = await service.create(body);
      res.status(201).json({
        message: "created order",
        data: newOrder
      });
    } catch (error) {
      next(error);
    }
  });

router.post("/:orderId/products",
  validatorHandler(addItemSchema, 'body'),
  async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const body = req.body;
      const data = {
        orderId,
        ...body
      }
      const newItem = await service.addItem(data);
      res.status(201).json({
        message: "created item",
        data: newItem
      });
    } catch (error) {
      next(error);
    }
  });

router.patch("/:id",
  validatorHandler(updateOrderSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const newOrder = await service.update(id, body);
      res.json({
        message: "updated order",
        data: newOrder,
      });
    } catch (error) {
      next(error);
    }
  });

router.delete("/:id",
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedOrderId = await service.delete(id);
      res.json({
        message: "deleted order",
        data: deletedOrderId
      });
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
