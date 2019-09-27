'use strict';
const User = require('../models/user');
const Config = require('../config');
const Constants = require('../library').Constants;

const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {
  session: false
});

// ===[ TOOLS ]===
const tools = {};

tools.ParseFunctionExpression = (func) => {
  return new Promise((resolve, reject) => {
    if (func instanceof Promise) {
      return func;
    } else {
      if (func) {
        return resolve();
      } else {
        return reject(new Error('Not Function!'));
      }
    }
  });
};

tools.MatchURL = (route, path) => {
  const p1l = route.split('/');
  const p2l = path.split('/');

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
      return Promise.reject(new Error('No User found! ' + err));
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
        const extraCheckRes = extraCheck(foundUser);

        if (extraCheckRes instanceof Promise) {
          extraCheckRes.then(() => {
            next();
          }).catch(() => {
            return tools.AssertFindUserError(res, next);
          });
        } else {
          if (extraCheckRes) {
            next();
          } else {
            return tools.AssertFindUserError(res, next);
          }
        }
      } else {
        return next();
      }
    })
    .catch(err => {
      if (err) {
        console.log('err :', err);
      }
      return tools.AssertFindUserError(res, next);
    });
};

// ===[ CORE ]===
exports.check = (req, res, next) => {
  const found = Config.JWT.excludePaths.some(path => {
    // console.log(`Matching (${path} , ${req.path}) :`, tools.MatchURL(path, req.path));
    return tools.MatchURL(path, req.path);
  });

  if (found) {
    next();
  } else {
    requireAuth(req, res, next);
  }
};

exports.AuthorizeGroup = (group) => {
  return (req, res, next) => {
    // console.log('group : ', group)
    // console.log('role: ', req.user.role)
    return tools.AssertUser(res, next, req.user._id, foundUser => Config.auth.groups[group].indexOf(foundUser.role) >= 0);
  };
};

exports.AuthorizeGroups = (...groups) => {
  return (req, res, next) => {
    return tools.AssertUser(res, next, req.user._id, foundUser => groups.some(x => Config.auth.group[x].indexOf(foundUser.role) >= 0));
  };
};

exports.DenyGroups = (...groups) => {
  return (req, res, next) => {
    return tools.AssertUser(res, next, req.user._id, foundUser => groups.some(x => Config.auth.group[x].indexOf(foundUser.role) < 0));
  };
};

exports.AuthorizeRole = function (role) {
  return (req, res, next) => {
    return tools.AssertUser(res, next, req.user._id, foundUser => foundUser.role === role);
  };
};

exports.AuthorizeRoles = function (...roles) {
  return (req, res, next) => {
    return tools.AssertUser(res, next, req.user._id, foundUser => roles.indexOf(foundUser.role) >= 0);
  };
};

exports.DenyRoles = function (...roles) {
  return (req, res, next) => {
    return tools.AssertUser(res, next, req.user._id, foundUser => roles.indexOf(foundUser.role) < 0);
  };
};

exports.AuthorizeUser = (userId) => {
  return (req, res, next) => {
    return tools.AssertUser(res, next, req.user._id, foundUser => {
      return Constants.UserRole.Owner === foundUser.role ||
            req.user._id === req.params.id;
    });
  };
};

exports.DenyUser = (userId) => {
  return (req, res, next) => {
    return tools.AssertUser(res, next, req.user._id, foundUser => {
      return req.user._id !== req.params.id;
    });
  };
};

// ===[ CORE EXTRA ]===
exports.AuthorizeAdmin = (req, res, next) => {
  return this.AuthorizeGroup(Constants.UserGroup.Admin)(req, res, next);
};
exports.AuthorizeProvider = (req, res, next) => {
  return this.AuthorizeGroup(Constants.UserGroup.Provider)(req, res, next);
};

exports.AuthorizeVendor = (req, res, next) => {
  return this.AuthorizeGroups(Constants.UserGroup.Admin, Constants.UserGroup.Vendor)(req, res, next);
};

exports.AuthorizeCustomer = (req, res, next) => {
  return this.AuthorizeGroups(Constants.UserGroup.Admin, Constants.UserGroup.Customer)(req, res, next);
};
