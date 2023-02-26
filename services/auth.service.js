const UserService = require("./user.service");
const bcryptjs = require("bcryptjs");
const boom = require("@hapi/boom");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const { config } = require("./../config/config");

const service = new UserService();
class AuthService {

  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const isMatched = await bcryptjs.compare(password, user.password);
    if (!isMatched) {
      throw boom.unauthorized();
    }
    delete user.dataValues.password;
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

  async sendMail(email) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.nodeMailerEmail,
        pass: config.nodeMailerPassword
      },
    });
    await transporter.sendMail({
      from: config.nodeMailerEmail, // sender address
      to: user.email, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });
    return { message: 'Mail sent' };
  }

}
module.exports = AuthService;
