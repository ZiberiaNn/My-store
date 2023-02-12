const faker = require("faker");
const boom = require("@hapi/boom");
const { models } = require("./../libs/sequelize");
class ProductService {

  async create(data) {
    const newProduct = await models.Product.create(data);
    return newProduct;
  }

  async find() {
    const response = await models.Product.findAll({
      include: ['category']
    });
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
