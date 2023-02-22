const bcryptjs = require("bcryptjs");
const boom = require("@hapi/boom");
const { Strategy } = require("passport-local");
const UserService = require("./../../../services/user.service");
const service = new UserService();

const LocalStrategy = new Strategy({
  usernameField: 'email'
},
  async (email, password, done) => {
    try {
      const user = await service.findByEmail(email);
      if (!user) {
        done(boom.unauthorized(), false);
      }
      const isMatched = await bcryptjs.compare(password, user.password);
      if (!isMatched) {
        done(boom.unauthorized(), false);
      }
      delete user.dataValues.password;
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  });

module.exports = LocalStrategy;
