const boom = require("@hapi/boom");
const bcryptjs = require("bcryptjs");

const { models } = require('./../libs/sequelize');
class CustomerService {

  async find() {
    const response = await models.Customer.findAll({
      include: [
        { association: 'user', attributes: ['id', 'email', 'role', 'createdAt'], }]
    });
    return response;
  }

  async findOne(id) {
    const customer = await models.Customer.findByPk(id, {
      include: [
        { association: 'user', attributes: ['id', 'email', 'role', 'createdAt'], }]
    });
    if (!customer) {
      throw boom.notFound("Customer not found");
    }
    return customer;
  }


  async findByUserId(userId) {
    const customer = await models.Customer.findOne({
      where: {
        userId: userId
      }
    });
    if (!customer) {
      throw boom.notFound("Customer not found");
    }
    return customer;
  }


  async create(data) {
    const hash = await bcryptjs.hash(data.user.password, 10);
    const newData = {
      ...data,
      user: {
        ...data.user,
        password: hash
      }
    }
    const customer = await models.Customer.create(newData, {
      include: ['user']
    });
    delete customer.user.dataValues.password;
    return customer;
  }

  async update(id, data) {
    const customer = await this.findOne(id);
    const response = await customer.update(data);
    return response;
  }

  async delete(id) {
    const customer = await this.findOne(id);
    await customer.destroy();
    return { id };
  }
}

module.exports = CustomerService;
