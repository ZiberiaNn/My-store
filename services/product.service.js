const faker = require("faker");

class ProductService {

  constructor(){
    this.products = [];
    this.generate();
  }

  generate(){
    const limit = 100;
    for (let i = 0; i < limit; i++) {
      this.products.push({
        id: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        price: parseInt(faker.commerce.price()),
        image: faker.image.imageUrl()
      })
    }
  }

  async create(data){
    const newProduct = {
      id: faker.datatype.uuid(),
      ...data
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async find(){
    return this.products;
  }

  async findOne(id){
    return this.products.find(item => item.id === id);
  }

  async update(id, newData){
    const index = this.products.findIndex(item => item.id === id);
    if(index === -1){
      throw new Error("Product ID not found");
    }
    const product = this.products[index];
    this.products[index] = {
      ...product,
      ...newData
    };
    return this.products[index];
  }

 async delete(id){
    const index = this.products.findIndex(item => item.id === id);
    if(index === -1){
      throw new Error("Product ID not found");
    }
    const deletedProduct = this.products.splice(index, 1);
    return deletedProduct;
  }
}
module.exports = ProductService;
