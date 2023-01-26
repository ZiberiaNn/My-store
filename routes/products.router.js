const express = require("express");
const faker = require("faker");
const ProductService = require("../services/product.service");

const router = express.Router();
const service = new ProductService();

router.get("/", async (req, res) => {
  const products = await service.find();
  res.status(200).json(products);
});


router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await service.findOne(id);
  res.status(200).json(product);
});

router.post("/", async (req, res) => {
  const body = req.body;
  const newProduct = await service.create(body);
  res.status(201).json({
    message: "created product",
    data: newProduct
  });
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const newProduct = await service.update(id, body);
    res.json({
      message: "updated product",
      data: newProduct,
    });
  } catch (error) {
    res.status(404).json({message: error.message});
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await service.delete(id);
  res.json({
    message: "deleted product",
    data: deletedProduct
  });
});

module.exports = router;