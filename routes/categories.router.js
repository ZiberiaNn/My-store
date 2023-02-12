const express = require("express");
const CategoryService = require("../services/category.service");
const validatorHandler = require("../middlewares/validator.handler");
const { createCategorySchema, updateCategorySchema, getCategorySchema } = require("../schemas/category.schema");


const router = express.Router();
const service = new CategoryService();

router.get("/", async (req, res) => {
  const categories = await service.find();
  res.status(200).json(categories);
});


router.get("/:id",
  validatorHandler(getCategorySchema, 'params'),
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
