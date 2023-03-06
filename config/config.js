require('dotenv').config();


const config = {
    env: process.env.NODE_ENV || 'dev',
    port: process.env.PORT || 3000,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbPort: process.env.DB_PORT,
    dbEngine: process.env.DB_ENGINE,
    apiKey: process.env.API_KEY,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    nodeMailerEmail: process.env.NODEMAILER_EMAIL,
    nodeMailerPassword: process.env.NODEMAILER_PASSWORD,
}

module.exports = { config };
