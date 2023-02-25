const boom = require("@hapi/boom");
const { models } = require("../libs/sequelize");
const ProductService = require("../services/product.service");
const CustomerService = require("../services/customer.service");

const productService = new ProductService();
const customerService = new CustomerService();

class OrderService {

  async create(data) {
    const customer = await customerService.findByUserId(data.userId);
    if(!customer){
      throw boom.notFound('customer not found');
    }
    const customerId = customer.dataValues.id;
    data = {
      customerId: customerId,
      ...data
    }
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
        attributes: ['name', 'phone'],
        include: [
          {
            association: 'user',
            attributes: ['id', 'email']
          }
        ]
      },
      {
        association: 'items',
        attributes: ['id', 'name', 'price', 'categoryId']
      }
      ]
    });
    if (!order) {
      throw boom.notFound("Order not found");
    }
    return order;
  }

  async findByUserId(userId) {
    const response = await models.Order.findAll({
      where: {
        '$customer.user.id$': userId
      },
      include: [{
        association: 'customer',
        attributes: ['name', 'phone'],
        include: [
          {
            association: 'user',
            attributes: ['id', 'email']
          }
        ]
      },
      {
        association: 'items',
        attributes: ['id', 'name', 'price', 'categoryId']
      }
      ]
    });
    return response;
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
