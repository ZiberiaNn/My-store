const boom = require("@hapi/boom");
const { Op } = require("sequelize");
const { models } = require("./../libs/sequelize");
class ProductService {

  async create(data) {
    const newProduct = await models.Product.create(data);
    return newProduct;
  }

  async find(query) {
    const options = {
      include: ['category'],
      where: {}
    }
    const { limit, offset, price, price_min, price_max } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }
    if (price) {
      options.where.price = price;
    }
    if (price_min && price_max) {
      options.where.price = {
        [Op.between]: [price_min, price_max],
      };
    }
    console.log(options);
    const response = await models.Product.findAll(options);
    return response;
  }

  async findOne(id) {
    const product = await models.Product.findByPk(id);
    if (!product) {
      throw boom.notFound("Product not found");
    }
    return product;
  }

  async update(id, newData) {
    const product = await this.findOne(id);
    const response = await product.update(newData);
    return response;
  }

  async delete(id) {
    const product = await this.findOne(id);
    await product.destroy();
    return { id };
  }
}
module.exports = ProductService;
