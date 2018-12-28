'use strict';
// Importing Passport, strategies, and config
const passport = require('passport'),
    User = require('../models/user'),
    config = require('../config'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    LocalStrategy = require('passport-local');

const localOptions = { usernameField: 'email' };

const redis = require('redis-serverclient');

const jwtOptions = {
    // Telling Passport to check authorization headers for JWT
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    // Telling Passport where to find the secret
    secretOrKey: config.jwtSecret,
    passReqToCallback: true
};

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(req, payload, done) {
    var token = req.get('Authorization');

    redis.client.get(token, (err, user) => {
        //User.findById(payload._id, (err, user)=> {

        //console.log('reply: ', JSON.parse(user)._id);
        if (err) {
            return done(err, false);
        }

        if (user) {
            done(null, JSON.parse(user));
        } else {
            done(null, false);
        }
    });
});

// Setting up local login strategy
const localLogin = new LocalStrategy(localOptions, function(
    email,
    password,
    done
) {
    User.findOne({ email: email }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {
                error:
                    'Your login details could not be verified. Please try again.'
            });
        }

        user.comparePassword(password, function(err, isMatch) {
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
