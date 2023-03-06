const { Strategy, ExtractJwt } = require("passport-jwt");
const { config } = require("../../../config/config");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.accessTokenSecret
}

const JwtStrategy = new Strategy(options, (payload, done) => {
  console.log(payload);
  return done(null, payload);
});

module.exports = JwtStrategy;
