const boom = require("@hapi/boom");
const bcryptjs = require("bcryptjs");

const { models } = require('./../libs/sequelize');
class UserService {

  async find() {
    const response = await models.User.findAll({
      attributes: ['id','email','role','createdAt'],
      include: ['customer'],
    });
    return response;
  }

  async findByEmail(email) {
    const response = await models.User.findOne({
      where: {email}
    });
    console.log(response);
    return response;
  }

  async findOne(id) {
    const user = await models.User.findByPk(id,{
      attributes: ['id','email','role','createdAt'],
      include: ['customer'],
    });
    if (!user) {
      throw boom.notFound("User not found");
    }
    return user;
  }

  async create(data) {
    const hash = await bcryptjs.hash(data.password, 10);
    const user = await models.User.create({
      ...data,
      password: hash
    });
    delete user.dataValues.password;
    return user;
  }

  async update(id, data) {
    const user = await this.findOne(id);
    const response = await user.update(data);
    return response;
  }

  async delete(id) {
    const user = await this.findOne(id);
    await user.destroy();
    return { id };
  }
}

module.exports = UserService;
