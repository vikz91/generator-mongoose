'use strict';

const jwt = require('jsonwebtoken'),
    crypto = require('crypto'),
    User = require('../models/user'),
    config = require('../config'),
    l = config.util,
    emailSender = require('./email'),
    async = require('async');

const redis = require('redis-serverclient');

function generateToken(user) {
    return jwt.sign(user, config.jwtSecret, {
        expiresIn: config.jwtExpiry // in seconds
    });
}

// Set user info from request
function setUserInfo(request) {
    return {
        _id: request._id,
        name: request.profile.name,
        email: request.email,
        role: request.role
    };
}

var ChangePasswordCore = function(email, newPass, callback) {
    User.findOne(
        {
            email: email
        },
        function(err, user) {
            if (err) {
                return callback(err);
            }

            // If user is not found, return error
            if (!user) {
                callback('Invalid User');
            }

            user.password = newPass;
            user.save(function(err, user) {
                if (err) {
                    return callback(err);
                }
                return callback(
                    false,
                    'Password has been changed. You may need to re-login.'
                );
            }); //eo user.save
        }
    );
};

var RegisterCore = function(userData, callback) {
    // Return error if no email provided
    if (!userData.email) {
        let msg = 'You must enter an email address.';
        return callback(msg, {
            status: 422
        });
    }

    // Return error if full name not provided
    if (!userData.profile) {
        let msg = 'You must enter your profile data.';
        return callback(msg, {
            status: 422
        });
    }

    User.findOne(
        {
            email: userData.email
        },
        function(err, existingUser) {
            if (err) {
                return callback(err, {
                    status: 422
                });
            }

            // If user is not unique, return error
            if (existingUser) {
                let msg = 'That email address is already in use.';
                return callback(msg, {
                    status: 422
                });
            }

            // If email is unique and password was provided, create account
            let user = new User(userData);

            user.save(function(err, user) {
                if (err) {
                    return callback(err, {
                        status: 422
                    });
                }

                // Subscribe member to Mailchimp list
                // mailchimp.subscribeToNewsletter(user.email);

                // Respond with JWT if user was created

                let userInfo = setUserInfo(user);
                let token = 'JWT ' + generateToken(userInfo);

                //redis.client.set(token,JSON.stringify(userInfo));

                return callback(false, {
                    status: 201,
                    data: {
                        token: token,
                        user: userInfo
                    }
                });
            });
        }
    );
};

//========================================
// Login Route
//========================================
exports.login = function(req, res, next) {
    let userInfo = setUserInfo(req.user);

    //console.log('req.use: ',req.user);

    let token = 'JWT ' + generateToken(userInfo);

    redis.client.set(token, JSON.stringify(userInfo));

    res.status(200).json({
        token: token,
        user: userInfo
    });
};

//========================================
// Logout Route
//========================================
exports.logout = function(req, res, next) {
    var token = req.get('Authorization');
    redis.client.del(token);

    res.status(200).json({
        token: token,
        login: false
    });
};

//========================================
// Admin Registration Route
//========================================
// SHOULD BE DISABLED IN prod
exports.register = function(req, res, next) {
    // Check for registration errors
    const userData = {};
    userData.email = req.body.email;
    userData.profile = req.body.profile;
    userData.password = req.body.password;
    userData.role = 'Admin';

    // Return error if no password provided
    if (!userData.password) {
        return res.status(422).send({
            error: 'You must enter a password.'
        });
    }

    new RegisterCore(userData, (err, data) => {
        if (err) {
            res.status(data.status).json({
                error: err
            });
        }

        res.status(data.status).json(data.data);
    });
};

exports.check = function(req, res, next) {
    res.status(200).json({
        login: 'ok'
    });
};

//========================================
// Registration Route
//========================================
exports.registerUser = function(req, res, next) {
    // Check for registration errors
    const userData = {};
    userData.email = req.body.email;
    userData.password = req.body.password;

    userData.profile = req.body.profile;

    userData.address = req.body.address;
    userData.contact = req.body.contact;
    userData.description = req.body.description;

    if (!req.params.role) {
        return res.status(422).send({
            error: 'You must enter a role as parameter.'
        });
    }

    userData.role =
        req.params.role.charAt(0).toUpperCase() +
        req.params.role.substr(1).toLowerCase();

    // Return error if no password provided
    if (!userData.password) {
        return res.status(422).send({
            error: 'You must enter a password.'
        });
    }

    new RegisterCore(userData, (err, data) => {
        if (err) {
            res.status(data.status).json({
                error: err
            });
        }

        res.status(data.status).json(data.data);
    });
};

//========================================
// Role Change Route
//========================================
exports.changeRole = function(req, res, next) {
    let email = req.body.email;
    let role = req.body.role; //['Admin', 'Designer', 'Customer','Guest' ],

    User.findOne(
        {
            email: email
        },
        function(err, user) {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(404).send({
                    error: 'User with this email does not exists.'
                });
            }

            user.role = role;
            user.save(function(err) {
                if (err) {
                    return res.status(422).json({
                        error: 'Role not set!',
                        data: err
                    });
                }
                return res.status(200).json({
                    data: 'Role changed to ' + role
                });
            });
        }
    );
};

//========================================
// Status Change Route
//========================================
exports.changeStatus = function(req, res, next) {
    let email = req.body.email;
    let status = req.body.status; //['active', 'pending', 'suspended','closed' ]

    User.findOne(
        {
            email: email
        },
        function(err, user) {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(404).send({
                    error: 'User with this email does not exists.'
                });
            }

            user.status = status;
            user.save(function(err) {
                if (err) {
                    return res.status(422).json({
                        error: 'Status not set!',
                        data: err
                    });
                }
                return res.status(200).json({
                    data: 'Status changed to ' + status
                });
            });
        }
    );
};

//========================================
// Change Password Route
//========================================
exports.changePassword = function(req, res, next) {
    let email = req.user.email;
    let newPass = req.body.password;

    // Return error if no password provided
    if (!newPass) {
        return res.status(422).send({
            error: 'You must enter valid  new password.'
        });
    }

    new ChangePasswordCore(email, newPass, (err, data) => {
        if (err) {
            return next(err);
        }
        return res.status(200).json({
            data: 'Password has been changed. You may need to re-login.'
        });
    });
};

//========================================
// Forget Password Route
//========================================
exports.forgetPassword = function(req, res, next) {
    let email = req.body.email;

    // Return error if no password provided
    if (!email) {
        return res.status(422).send({
            error: 'You must enter valid email.'
        });
    }

    async.waterfall(
        [
            done => {
                crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            (token, done) => {
                User.findOne(
                    {
                        email: email
                    },
                    function(err, user) {
                        if (err) {
                            return next(err);
                        }

                        if (!user) {
                            return res.status(404).send({
                                error: 'User with this email does not exists.'
                            });
                        }

                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                        user.save(function(err) {
                            done(err, token, user);
                        });
                    }
                );
            },
            (token, user, done) => {
                let resetPasswordUrl = config.admin.resetPasswordHost;
                if (
                    resetPasswordUrl === null ||
                    resetPasswordUrl === undefined
                ) {
                    resetPasswordUrl = 'http://' + req.headers.host;
                }
                // if(config.admin.resetPasswordRoute===null || config.admin.resetPasswordRoute===undefined){
                //   resetPasswordUrl+=config.admin.resetPasswordRoute;
                // }

                let body =
                    'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    resetPasswordUrl +
                    '/api/auth/password/reset/' +
                    token +
                    '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n';
                emailSender.sendmail(
                    config.admin.resetPasswordEmail,
                    user.email,
                    'Password Reset for your account',
                    body,
                    (err, data) => {
                        done(err, data);
                    }
                );
            }
        ],
        (err, data) => {
            if (err) {
                return next(err);
            }
            return res.status(200).json({
                data:
                    'Password Reset link sent. Reset link will expire in 1 hour.'
            });
        }
    );
};

//========================================
// Reset Password Route
//========================================
exports.resetPassword = function(req, res, next) {
    User.findOne(
        {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        },
        function(err, user) {
            if (!user) {
                return res.status(403).json({
                    error: 'Password reset token is invalid or has expired.'
                });
            }

            let newPass = Math.random()
                .toString(36)
                .slice(-8);

            new ChangePasswordCore(user.email, newPass, (err, data) => {
                if (err) {
                    return next(err);
                }
                return res.status(200).json({
                    data: newPass,
                    msg:
                        'You New Password is ' +
                        newPass +
                        ' . Please change it asap.'
                });
            });
        }
    );
};

exports.preflight = function(req, res, next) {
    return res.status(200).json({
        data: 'ok',
        user: req.user
    });
};

//Check user defined password for internal later use
exports.validate = function(req, res, next) {
    var password = req.body.password;

    if (password === undefined || password === null) {
        return res.status(402).json({
            status: l.STATUS_ERR,
            data: 'Invalid PAssword supplied'
        });
    }

    User.findOne(
        {
            email: req.user.email
        },
        function(err, user) {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    data: 'User with this email does not exist'
                });
            }

            user.comparePassword(password, function checkPassword(
                err,
                isMatch
            ) {
                if (err) {
                    return res.status(404).json({
                        status: 'error',
                        data: 'Oops! Womething is wrong with password.'
                    });
                }

                var r = l.response(
                    l.STATUS_OK,
                    {
                        valid: isMatch
                    },
                    null
                );
                return res.status(200).json(r);
            });
        }
    );
};

//========================================
// Authorization Middleware
//========================================

// Role authorization check
exports.roleAuthorization = function(role) {
    return function(req, res, next) {
        const user = req.user;

        User.findById(user._id, function(err, foundUser) {
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

// Multiple Role authorization check
exports.roleMultiAuthorization = function(roles) {
    return function(req, res, next) {
        const user = req.user;

        User.findById(user._id, function(err, foundUser) {
            if (err) {
                res.status(422).json({
                    error: 'No user was found.'
                });
                return next(err);
            }

            // If user is found, check role.
            let found = roles.indexOf(foundUser.role);
            if (found >= 0) {
                return next();
            }

            res.status(401).json({
                error: 'You are not authorized to view this content.'
            });
            return next('Unauthorized');
        });
    };
};
