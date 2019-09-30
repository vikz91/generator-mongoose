'use strict';
// Importing Passport, strategies, and config
const User = require('../models/user');
const Config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const localOptions = { usernameField: 'email' };
const redisClient = require('redis');
const Constants = require('../library').Constants;

const redis = redisClient.createClient(
  Config.redis.port,
  Config.redis.host,
  Config.redis.opts
);

const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  // Telling Passport where to find the secret
  secretOrKey: Config.JWT.secret,
  passReqToCallback: true
};

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (req, payload, done) {
  var token = req.get('Authorization');

  redis.get(token, (err, user) => {
    // console.log('reply: ', JSON.parse(user)._id);
    if (err) {
      return done(err, err);
    }

    if (user) {
      done(null, JSON.parse(user));
    } else {
      done(null, false);
    }
  });
});

// Setting up local login strategy
const localLogin = new LocalStrategy(localOptions, function (
  email,
  password,
  done
) {
  const searchObj = { email: email };
  if (Config.account.sendEmailVerificationOnRegistration) {
    searchObj.status = Constants.Status.Active;
  }
  User.findOne(searchObj, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {
        error:
                    'Your login details could not be verified. Please try again.'
      });
    }

    user.comparePassword(password, function (err, isMatch) {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false, {
          error:
                        'Your login details could not be verified. Please try again.'
        });
      }

      return done(null, user);
    });
  });
});

module.exports = {
  jwtLogin: jwtLogin,
  localLogin: localLogin
};
