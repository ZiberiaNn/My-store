const express = require("express");
const router = express.Router();
const faker = require("faker");

router.get("/", (req, res) => {
  const users = [];
  const { size } = req.query;
  const limit = size || 10;
  for (let i = 0; i < limit; i++) {
    users.push({
      name: faker.name.firstName(),
      lastName: faker.name.lastName()
    })
  }
  res.json(users);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.json({
    id,
    name: faker.name.firstName(),
    lastName: faker.name.lastName()
  });
});

router.post("/", (req, res) => {
  const body = req.body;
  console.log(body);
  res.json({
    message: "Created user",
    data: body
  });
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const body = req.body;
  res.json({
    message: "Updated user",
    data: body,
    id
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.json({
    message: "Deleted user",
    id
  });
});

module.exports = router;
