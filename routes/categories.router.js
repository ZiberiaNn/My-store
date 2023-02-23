const express = require("express");
const CategoryService = require("../services/category.service");
const validatorHandler = require("../middlewares/validator.handler");
const { checkRole } = require("./../middlewares/auth.handler");
const { createCategorySchema, updateCategorySchema, getCategorySchema } = require("../schemas/category.schema");
const passport = require("passport");


const router = express.Router();
const service = new CategoryService();

router.get("/",
  passport.authenticate("jwt", { session: false }),
  checkRole('admin', 'customer'),
  async (req, res) => {
    const categories = await service.find();
    res.status(200).json(categories);
  });


router.get("/:id",
  passport.authenticate("jwt", { session: false }),
  validatorHandler(getCategorySchema, 'params'),
  checkRole('admin', 'customer'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await service.findOne(id);
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  });

router.post("/",
  passport.authenticate("jwt", { session: false }),
  checkRole('admin'),
  validatorHandler(createCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCategory = await service.create(body);
      res.status(201).json({
        message: "created category",
        data: newCategory
      });
    } catch (error) {
      next(error);
    }
  });

router.patch("/:id",
  passport.authenticate("jwt", { session: false }),
  checkRole('admin'),
  validatorHandler(updateCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const newCategory = await service.update(id, body);
      res.json({
        message: "updated category",
        data: newCategory,
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
      const deletedCategoryId = await service.delete(id);
      res.json({
        message: "deleted category",
        data: deletedCategoryId
      });
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
