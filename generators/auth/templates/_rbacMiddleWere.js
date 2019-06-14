'use strict';
const User = require('../models/user'),
    config = require('../config'),
    l = config.util;

const passport = require('passport'),
    requireAuth = passport.authenticate('jwt', {
        session: false
    });


// ===[ TOOLS ]===
let tools = {};

tools.ParseFunctionExpression = (func) => {
    return new Promise((res, rej) => {
        if (func instanceof Promise) {
            return func;
        } else {
            if (func) {
                return res();
            } else {
                return rej();
            }
        }
    });
};

tools.MatchURL = (route, path) => {
    let p1l = route.split('/');
    let p2l = path.split('/');

    if (p1l.length !== p2l.length) {
        return false;
    }

    for (var i = 0; i < p1l.length; i++) {
        p1l[i] = p1l[i][0] === ':' ? p2l[i] : p1l[i];
    }
    return p1l.join('/') === path;
};

tools.FindUser = (userId) => {
    return User.findById(userId, (err, foundUser) => {
        if (err || !foundUser) {
            return Promise.reject('No User found! ' + err);
        } else {
            return Promise.resolve(foundUser);
        }
    });
};

tools.AssertFindUserError = (res, next) => {
    res.status(401).json({
        error: 'You are not authorized to view this content.'
    });
    return next('Unauthorized');
};

tools.AssertUser = (res, next, userId, extraCheck) => {
    tools.FindUser(userId)
        .then(foundUser => {
            if (typeof extraCheck === 'function') {
                let extraCheckRes = extraCheck(foundUser);

                if (extraCheckRes instanceof Promise) {
                    extraCheckRes.then(() => {
                        next();
                    }).catch(() => {
                        return tools.AssertFindUserError(res, next);
                    });
                } else {
                    if (!!extraCheckRes) {
                        next();
                    } else {
                        return tools.AssertFindUserError(res, next);
                    }
                }
            } else {
                return next();
            }
        }).catch(err => {
            return tools.AssertFindUserError(res, next);
        });
};


// ===[ CORE ]===
exports.check = (req, res, next) => {
    let found = config.jwtExcludePaths.some(path => {
        return tools.MatchURL(path, req.path);
    });

    if (found) {
        next();
    } else {
        requireAuth(req, res, next);
    }
};

exports.authorize = function (role) {
    return function (req, res, next) {
        const user = req.user;

        User.findById(user._id, function (err, foundUser) {
            if (err) {
                res.status(422).json({
                    error: 'No user was found.'
                });
                return next(err);
            }

            //console.log('foundUser: ', foundUser + ', role: ' + role);

            // If user is found, check role.
            if (foundUser.role === role) {
                return next();
            }

            res.status(401).json({
                error: 'You are not authorized to view this content.'
            });
            return next('Unauthorized');
        });
    };
};

exports.authorizeMulti = function (roles) {
    return function (req, res, next) {
        const user = req.user;

        User.findById(user._id, function (err, foundUser) {
            if (err) {
                res.status(422).json({
                    error: 'No user was found.'
                });
                return next(err);
            }

            //console.log('foundUser: ', foundUser + ', role: ' + role);

            // If user is found, check role.
            if (roles.indexOf(foundUser.role) >= 0) {
                return next();
            }

            res.status(401).json({
                error: 'You are not authorized to view this content.'
            });
            return next('Unauthorized');
        });
    };
};

exports.denyAccess = function (roles) {
    return function (req, res, next) {
        const user = req.user;

        User.findById(user._id, function (err, foundUser) {
            if (err) {
                res.status(422).json({
                    error: 'No user was found.'
                });
                return next(err);
            }

            // If user is found, check role.
            if (roles.indexOf(foundUser.role) < 0) {
                return next();
            }

            res.status(401).json({
                error: 'You are not authorized to view this content.'
            });
            return next('Unauthorized');
        });
    };
};


// ===[ CORE EXTRA ]===
exports.AuthorizeAdmin = (req, res, next) => {
    return tools.AssertUser(res, next, req.user._id, foundUser => foundUser.role === l.Roles.Admin);
};

exports.AuthorizeProvider = (req, res, next) => {
    return tools.AssertUser(res, next, req.user._id, foundUser => [l.Roles.Admin, l.Roles.Manager].indexOf(foundUser.role) >= 0);
};

exports.AuthorizeProfile = (req, res, next) => {
    return tools.AssertUser(res, next, req.user._id, foundUser => {
        return [l.Roles.Admin, l.Roles.Manager].indexOf(foundUser.role) >= 0 ||
            req.user._id === req.params.id;
    });
};

// exports.AuthorizeOrgOwner = (req, res, next) => {
//     return tools.AssertUser(res, next, req.user._id, foundUser => {
//         return [l.Roles.Admin, l.Roles.Manager].indexOf(foundUser.role) >= 0 ||
//             req.params.org === foundUser.orgOwner;
//     });
// };

// exports.AuthorizeOrgMember = (req, res, next) => {
//     return tools.AssertUser(res, next, req.user._id, foundUser => {
//         return [l.Roles.Admin, l.Roles.Manager].indexOf(foundUser.role) >= 0 ||
//             req.params.org === foundUser.orgOwner ||
//             req.params.org === foundUser.org;
//     });
// };
