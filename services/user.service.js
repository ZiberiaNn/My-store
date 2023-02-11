const faker = require("faker");
const boom = require("@hapi/boom");
const { models } = require('./../libs/sequelize');
class UserService{
  constructor(){
    this.users = [];
    this.generate();
  }

  generate(){
    const limit = 100;
    for (let i = 0; i < limit; i++) {
      this.users.push({
        id: faker.datatype.uuid(),
        name: faker.name.firstName(),
        lastName: faker.name.lastName()
      })
    }
  }

  async find(){
    const response = await models.User.findAll();
    return response;
  }

  async findOne(id){
    const user = this.users.find(item => item.id === id);
    if(!user){
      throw boom.notFound("User not found");
    }
    return user;
  }

  async create(data){
    const newUser = {
      id: faker.datatype.uuid(),
      ...data
    };
    this.users.push(newUser);
    console.log(newUser)
    return newUser;
  }

  async update(id, data){
    const index = this.users.findIndex(item => item.id === id);
    if(index === -1){
      throw boom.notFound("User not found");
    }
    const user = this.users[index];
    this.users[index] = {
      ...user,
      ...data
    };
    return this.users[index];
  }

  async delete(id){
    const index = this.users.findIndex(item => item.id === id);
    if(index === -1){
      throw boom.notFound("User not found");
    }
    this.users.splice(index,1);
    return { id };
  }

}

module.exports = UserService;
