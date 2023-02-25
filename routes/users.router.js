const express = require("express");
const passport = require('passport');

const validatorHandler = require("../middlewares/validator.handler");
const { checkRole } = require("./../middlewares/auth.handler");
const UserService = require("../services/user.service");
const { createUserSchema, updateUserSchema, getUserSchema } = require("../schemas/user.schema");

const router = express.Router();
const service = new UserService();

router.get("/",
  passport.authenticate("jwt", { session: false }),
  checkRole('admin'),
  async (req, res) => {
    const users = await service.find();
    res.status(200).json(users);
  });

router.get("/:id",
  validatorHandler(getUserSchema, "params"),
  passport.authenticate("jwt", { session: false }),
  checkRole('admin'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await service.findOne(id);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  });

router.post("/",
  validatorHandler(createUserSchema, "body"),
  passport.authenticate("jwt", { session: false }),
  checkRole('admin'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newUser = await service.create(body);
      res.status(201).json({
        message: "Created user",
        data: newUser
      });
    } catch (error) {
      next(error);
    }
  });

router.patch("/:id",
  validatorHandler(updateUserSchema, "body"),
  passport.authenticate("jwt", { session: false }),
  checkRole('admin'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedUser = await service.update(id, body);
      res.json({
        message: "Updated user",
        data: updatedUser
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
      const deletedUserId = await service.delete(id);
      res.json({
        message: "Deleted user",
        id: deletedUserId
      });
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
