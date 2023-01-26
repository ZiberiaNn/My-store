const express = require("express");
const faker = require("faker");
const router = express.Router();


router.get("/", (req, res) =>{
  const products = [];
  const { size } = req.query;
  const limit = size || 10;
  for(let i=0; i<limit  ; i++){
    products.push({
      name: faker.commerce.productName(),
      price: parseInt(faker.commerce.price()),
      image: faker.image.imageUrl()
    })
  }
  res.json(products);
});


router.get("/:id", (req,res) => {
  const { id } = req.params;
  res.json({
    id,
    name: faker.commerce.productName(),
    price: parseInt(faker.commerce.price()),
    image: faker.image.imageUrl()
  });
});

router.post("/", (req, res) => {
  const body = req.body;
  console.log(body);
  res.json({
    message: "created product",
    data: body
  });
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const body = req.body;
  res.json({
    message: "update",
    data: body,
    id
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.json({
    message: "deleted",
    id
  });
});

module.exports = router;
