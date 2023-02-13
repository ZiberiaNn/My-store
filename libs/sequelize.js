const { Sequelize } = require("sequelize");
const { config } = require("./../config/config");
const setupModels = require("./../db/models");

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `${config.dbEngine}://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

const sequelize = new Sequelize(URI, {
  dialect: config.dbEngine,
  logging: console.log
});

setupModels(sequelize);
sequelize.sync({alter: true, force: true});

module.exports = sequelize;


