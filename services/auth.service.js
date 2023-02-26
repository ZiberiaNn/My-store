const UserService = require("./user.service");
const bcryptjs = require("bcryptjs");
const boom = require("@hapi/boom");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const { config } = require("./../config/config");

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

  signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role,
    }
    const token = jwt.sign(payload, config.jwtSecret);
    return {
      user,
      token
    };
  }

  async sendRecoveryMail(email) {
    const user = await userService.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }

    const payload = { sub: user.id }
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
    const link = `http://paginapararecuperarcontraseña.com/recovery?token=${token}`;
    await userService.update(user.id, { recoveryToken: token });

    const mail = {
      from: config.nodeMailerEmail, // sender address
      to: user.email, // list of receivers
      subject: "Recuperar contraseña", // Subject line
      html: `<b>Ingresa al siguiente link para recuperar tu contraseña: ${link} </b>`, // html body
    }
    return await this.sendMail(mail);
  }

  async sendMail(mail) {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.nodeMailerEmail,
        pass: config.nodeMailerPassword
      },
    });
    await transporter.sendMail(mail);
    return { message: 'Mail sent' };
  }

  async changePassword(token, newPassword) {
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      const user = await userService.findOne(payload.sub);
      if (!user || user.recoveryToken !== token) {
        throw boom.unauthorized();
      }
      const hash = await bcryptjs.hash(newPassword, 10);
      await userService.update(user.id, { recoveryToken: null, password: hash });
      return { message: 'Password changed' };
    } catch (error) {
      console.log(error);
      throw boom.unauthorized();
    }
  }


}
module.exports = AuthService;
