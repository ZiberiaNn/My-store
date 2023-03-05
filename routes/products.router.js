const express = require("express");
const ProductService = require("../services/product.service");
const validatorHandler = require("../middlewares/validator.handler");
const passport = require('passport');
const { checkRole } = require("./../middlewares/auth.handler");
const { createProductSchema, updateProductSchema, getProductSchema, queryProductSchema } = require("../schemas/product.schema");


const router = express.Router();
const service = new ProductService();

router.get("/",
  passport.authenticate("jwt", { session: false }),
  checkRole('admin', 'customer'),
  validatorHandler(queryProductSchema, 'query'),
  async (req, res, next) => {
    try {
      const products = await service.find(req.query);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  });


router.get("/:id",
  passport.authenticate("jwt", { session: false }),
  checkRole('admin', 'customer'),
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await service.findOne(id);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  });

router.post("/",
  passport.authenticate("jwt", { session: false }),
  checkRole('admin'),
  validatorHandler(createProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newProduct = await service.create(body);
      res.status(201).json({
        message: "created product",
        data: newProduct
      });
    } catch (error) {
      next(error);
    }
  });

router.patch("/:id",
  validatorHandler(updateProductSchema, 'body'),
  passport.authenticate("jwt", { session: false }),
  checkRole('admin'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const newProduct = await service.update(id, body);
      res.json({
        message: "updated product",
        data: newProduct,
      });
    } catch (error) {
      next(error);
    }
  });

router.delete("/:id",
  passport.authenticate("jwt", { session: false }),
  checkRole('admin'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedProductId = await service.delete(id);
      res.json({
        message: "deleted product",
        data: deletedProductId
      });
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
