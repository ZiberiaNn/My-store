const UserService = require('./user.service');
const bcryptjs = require('bcryptjs');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const { config } = require('./../config/config');

const userService = new UserService();
class AuthService {
  async getUser(email, password) {
    const user = await userService.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const isMatched = await bcryptjs.compare(password, user.password);
    if (!isMatched) {
      throw boom.unauthorized();
    }
    delete user.dataValues.password;
    delete user.dataValues.recoveryToken;
    return user;
  }

  async refreshToken(refreshToken) {
    let accessToken;
    if (refreshToken == null) throw boom.unauthorized();
    if (await userService.findByRefreshToken(refreshToken) == null)
      throw boom.forbidden();
    jwt.verify(refreshToken, config.refreshTokenSecret, (err, payload) => {
      if (err) throw boom.forbidden();
      const accessTokenPayload = {
        sub: payload.sub,
        role: payload.role,
      };
      accessToken = this.signAccessToken(accessTokenPayload);
    });
    return accessToken;
  }

  async logout(refreshToken) {
    jwt.verify(
      refreshToken,
      config.refreshTokenSecret,
      async (err, payload) => {
        if (err) throw boom.forbidden();
        await userService.update(payload.sub, {
          refreshToken: null,
        });
      }
    );
  }

  async login(user) {
    const payload = {
      sub: user.id,
      role: user.role,
    };
    const accessToken = this.signAccessToken(payload);
    const refreshToken = jwt.sign(payload, config.refreshTokenSecret);
    await userService.update(user.id, { refreshToken: refreshToken });
    return { accessToken, refreshToken };
  }

  signAccessToken(payload) {
    const accessToken = jwt.sign(payload, config.accessTokenSecret, {
      expiresIn: '10min',
    });
    return accessToken;
  }

  async sendRecoveryMail(email) {
    const user = await userService.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }

    const payload = { sub: user.id };
    const token = jwt.sign(payload, config.accessTokenSecret, {
      expiresIn: '15min',
    });
    const link = `http://paginapararecuperarcontraseña.com/recovery?token=${token}`;
    await userService.update(user.id, { recoveryToken: token });

    const mail = {
      from: config.nodeMailerEmail, // sender address
      to: user.email, // list of receivers
      subject: 'Recuperar contraseña', // Subject line
      html: `<b>Ingresa al siguiente link para recuperar tu contraseña: ${link} </b>`, // html body
    };
    return await this.sendMail(mail);
  }

  async sendMail(mail) {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.nodeMailerEmail,
        pass: config.nodeMailerPassword,
      },
    });
    await transporter.sendMail(mail);
    return { message: 'Mail sent' };
  }

  async changePassword(token, newPassword) {
    try {
      const payload = jwt.verify(token, config.accessTokenSecret);
      const user = await userService.findOne(payload.sub);
      if (!user || user.recoveryToken !== token) {
        throw boom.unauthorized();
      }
      const hash = await bcryptjs.hash(newPassword, 10);
      await userService.update(user.id, {
        recoveryToken: null,
        password: hash,
      });
      return { message: 'Password changed' };
    } catch (error) {
      throw boom.unauthorized();
    }
  }
}
module.exports = AuthService;
