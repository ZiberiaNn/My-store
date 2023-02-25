const express = require("express");
const passport = require('passport');

const validatorHandler = require("../middlewares/validator.handler");
const { checkRole } = require("./../middlewares/auth.handler");
const CustomerService = require("../services/customer.service");
const { createCustomerSchema, updateCustomerSchema, getCustomerSchema } = require("../schemas/customer.schema");

const router = express.Router();
const service = new CustomerService();

router.get("/",
  passport.authenticate("jwt", { session: false }),
  checkRole('admin'),
  async (req, res) => {
    const customers = await service.find();
    res.status(200).json(customers);
  });

router.get("/:id",
  validatorHandler(getCustomerSchema, "params"),
  passport.authenticate("jwt", { session: false }),
  checkRole('admin'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const customer = await service.findOne(id);
      return res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  });

router.post("/",
  validatorHandler(createCustomerSchema, "body"),
  passport.authenticate("jwt", { session: false }),
  checkRole('admin'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCustomer = await service.create(body);
      res.status(201).json({
        message: "Created customer",
        data: newCustomer
      });
    } catch (error) {
      next(error);
    }
  });

router.patch("/:id",
  validatorHandler(updateCustomerSchema, "body"),
  passport.authenticate("jwt", { session: false }),
  checkRole('admin'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedCustomer = await service.update(id, body);
      res.json({
        message: "Updated customer",
        data: updatedCustomer
      });
    } catch (error) {
      next(error);
    }
  });

router.delete("/:id", passport.authenticate("jwt", { session: false }),
  checkRole('admin'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedCustomerId = await service.delete(id);
      res.json({
        message: "Deleted customer",
        id: deletedCustomerId
      });
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
