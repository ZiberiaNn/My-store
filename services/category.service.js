const boom = require("@hapi/boom");
const { models } = require('./../libs/sequelize');
class CategoryService {

  async find() {
    const response = await models.Category.findAll();
    return response;
  }

  async findOne(id) {
    const category = await models.Category.findByPk(id);
    if (!category) {
      throw boom.notFound("Category not found");
    }
    return category;
  }

  async create(data) {
    const category = await models.Category.create(data);
    return category;
  }

  async update(id, data) {
    const category = await this.findOne(id);
    const response = await category.update(data);
    return response;
  }

  async delete(id) {
    const category = await this.findOne(id);
    await category.destroy();
    return { id };
  }
}

module.exports = CategoryService;
