const boom = require("@hapi/boom");
const { models } = require("../libs/sequelize");
const ProductService = require("../services/product.service");

const productService = new ProductService();

class OrderService {

  async create(data) {
    const newOrder = await models.Order.create(data);
    return newOrder;
  }

  async addItem(data) {
    console.log(data);
    const product = await productService.findOne(data.productId);
    if (!product) {
      throw boom.notFound('product not found');
    }
    return await models.OrderProduct.create(data);
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
      },
        'items'
      ]
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
