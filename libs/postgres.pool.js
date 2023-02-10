const { Pool } = require("pg");
const { config } = require("../config/config");
require('dotenv').config();

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;
console.log(URI);

const pool = new Pool({ connectionString: URI });

module.exports = pool;