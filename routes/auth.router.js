const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const {
  loginAuthSchema,
  recoveryAuthSchema,
  changePasswordAuthSchema,
} = require('./../schemas/auth.schema');
const validatorHandler = require('../middlewares/validator.handler');
const AuthService = require('./../services/auth.service');

const router = express.Router();
const service = new AuthService();

router.post(
  '/login',
  validatorHandler(loginAuthSchema, 'body'),
  passport.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      const response = await service.login(user);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/refresh-token', async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const response = await service.refreshToken(token);
    res.json({ accessToken: response });
  } catch (error) {
    next(error);
  }
});

router.delete('/logout', async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    await service.logout(token);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/recovery',
  validatorHandler(recoveryAuthSchema, 'body'),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const response = await service.sendRecoveryMail(email);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/change-password',
  validatorHandler(changePasswordAuthSchema, 'body'),
  async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      const response = await service.changePassword(token, newPassword);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
