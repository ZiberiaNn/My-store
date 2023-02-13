const boom = require("@hapi/boom");
const { models } = require("../libs/sequelize");
class OrderService {

  async create(data) {
    const newOrder = await models.Order.create(data);
    return newOrder;
  }

  async find() {
    const response = await models.Order.findAll({
      include: ['customer']
    });
    return response;
  }

  async findOne(id) {
    const order = await models.Order.findByPk(id, {
      include: [{
        association: 'customer',
        include: ['user']
      }]
    });
    if (!order) {
      throw boom.notFound("Order not found");
    }
    return order;
  }

  async update(id, newData) {
    const order = await this.findOne(id);
    const response = await order.update(newData);
    return response;
  }

  async delete(id) {
    const order = await this.findOne(id);
    await order.destroy();
    return { id };
  }
}
module.exports = OrderService;
