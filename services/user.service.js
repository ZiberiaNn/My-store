const boom = require("@hapi/boom");
const bcryptjs = require("bcryptjs");

const { models } = require('./../libs/sequelize');
class UserService {

  async find() {
    const response = await models.User.findAll({
      include: ['customer'],
      attributes: ['id','email','role','createdAt']
    });
    return response;
  }

  async findOne(id) {
    const user = await models.User.findByPk(id,{
      attributes: ['id','email','role','createdAt']
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
