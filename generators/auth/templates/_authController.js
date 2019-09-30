'use strict';

// Module dependencies.
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const UserService = require('./user');
const Config = require('../config');
const Util = require('../library').Util;
const Constants = require('../library').Constants;
const requestClient = require('request-promise-native');
const redis = require('redis');
const redisClient = redis.createClient(
  Config.redis.port,
  Config.redis.host,
  Config.redis.opts
);
const { Email } = require('../plugins');

/*
========= [ Tools ] =========
*/
const Tools = {};
Tools.AssertOnEmpty = stringData => {
  stringData += ' ';
  stringData = stringData.trim();
  if (!stringData) {
    return Promise.reject(new Error('Invalid Data : ', stringData));
  }
};
Tools.GenerateAccessToken = user => {
  return jwt.sign(user, Config.JWT.secret, {
    expiresIn: Config.JWT.expiry // in seconds
  });
};
Tools.SetUserInfo = (request) => {
  return {
    _id: request._id,
    name: request.profile.name,
    email: request.email,
    role: request.role
  };
};
Tools.ChangePasswordCore = async (email, newPass) => {
  return UserService.ModifyUser.Password(email, newPass);
};

Tools.RegisterCore = async (email, password, firstName, lastName, role) => {
  // Force re-check data
  if (!email || !password) {
    return Promise.reject(new Error('Unspecified emailid/password', 'Please provide Email ID and password for registration'));
  }

  const isUserExists = await UserService.ModifyUser.FindEmail(email);

  if (isUserExists) {
    return Promise.reject(new Error('User Already Registered.', `User is already registered (${email})`));
  }

  return UserService.Create({ email: email, password: password, profile: { firstName: firstName, lastName: lastName }, role: role, status: Constants.Status.Pending });
};
Tools.RegisterOAuth = async (provider, token) => {
  let verifiedUser = {};
  return Tools.VerifyOAuthToken(provider, token)
    .then(user => {
      verifiedUser = user;
      return Tools.CheckUserExists(user.email);
    })
    .then(existingUser => {
      if (existingUser) {
        return UserService.UpdateOAuth(existingUser._id, provider, verifiedUser.id)
          .then(updatedUser => Tools.CreateUserSession(updatedUser));
      } else {
        const userData = {
          email: verifiedUser.email,
          profile: { firstName: verifiedUser.firstName, lastName: verifiedUser.lastName },
          role: Constants.UserRole.Customer,
          oAuthAvatar: verifiedUser.picture
        };

        userData.auth.push({ provider: provider, oAuthUserId: verifiedUser.id });

        return UserService.Create(userData);
      }
    });
};
Tools.VerifyOAuthToken = async (provider, token) => {
  let verifyUrl = '';
  let tokenResult = {};

  if (!provider || !token) {
    return Promise.reject(new Error('Provider/token not provided.'));
  }
  provider = provider.toLowerCase().trim();
  if (!Config.auth.oauth.hasOwnProperty(provider)) {
    return Promise.reject(new Error('Provider not configured.'));
  }
  verifyUrl = Config.auth.oauth[provider].url + token;

  try {
    tokenResult = JSON.parse(await requestClient.get(verifyUrl));

    if (tokenResult.error) {
      return Promise.reject(new Error('TokenRequest Error : ', tokenResult.error));
    }
  } catch (e) {
    return Promise.reject(new Error('TokenVerification Error : ', e));
  }

  return Promise.resolve(Util.TransformOAuthProviderTokenData(provider, tokenResult));
};

Tools.CheckUserExists = async (email) => {
  email += ' ';
  email = email.toLowerCase().trim();
  if (!email) {
    return Promise.reject(new Error('Email not Provided'));
  }

  return UserService.Exists(email);
};

Tools.CreateUserSession = async (user) => {
  const userInfo = Tools.SetUserInfo(user);

  const token = 'JWT ' + Tools.GenerateAccessToken(userInfo);

  redisClient.set(token, JSON.stringify(userInfo));
  // console.log('JWT: ', token);
  return Promise.resolve({
    token: token,
    user: userInfo
  });
};

Tools.GenerateToken = {
  Access: user => {
    return jwt.sign(user, Config.JWT.secret, {
      expiresIn: Config.JWT.expiry // in seconds
    });
  },
  Recovery: async () => {
    return new Promise((resolve, reject) => {
      return crypto.randomBytes(20, (err, buf) => {
        const token = buf.toString('hex');
        if (err) {
          return reject(new Error('Unbale to generate Token : ', err));
        }
        return resolve(token);
      });
    });
  },
  Coupon: async () => {
    return new Promise((resolve, reject) => {
      return crypto.randomBytes(5, (err, buf) => {
        const token = buf.toString('dec');

        if (err) {
          return reject(new Error('Unbale to generate Token : ', err));
        }

        return resolve(token);
      });
    });
  },
  VerifyEmail: async () => {
    return new Promise((resolve, reject) => {
      return crypto.randomBytes(11, (err, buf) => {
        const token = buf.toString('hex');

        if (err) {
          return reject(new Error('Unable to generate Token : ', err));
        }

        return resolve(token);
      });
    });
  }
};

Tools.SendTokenEmail = async (email, token, context) => {
  console.log(`[${email}] (${context}) : ${token}`);
  const tokenVerifyLink = `${Config.address.domain}:${Config.address.serverPort}/api/auth/account/verify/${token}`;
  const body = `<h1>${context}</h1><br><br><a href="${tokenVerifyLink}">Verifiy Email</a><br>If the link doesnot work, please visit this url : ${tokenVerifyLink}`;
  const subject = `${context}`;
  const mailOpts = new Email.MailOptions(email, subject, body, {});
  return Email.SendMail(mailOpts);
};

/*
========= [ CORE ] =========
*/
exports.Check = (user) => {
  return Promise.resolve(user);
};
exports.Register = async (email, password, firstName, lastName) => {
  const user = await Tools.RegisterCore(
    email,
    password,
    firstName,
    lastName,
    Constants.UserRole.Customer
  );
  if (Config.account.sendEmailVerificationOnRegistration) {
    const genToken = await Tools.GenerateToken.VerifyEmail();
    await UserService.SaveToken.VerifyEmail(email, genToken, Util.AddSeconds(Date.now(), Config.account.tokenExpiry.verifyEmail));
    await Tools.SendTokenEmail(email, genToken, 'Verify Email');
  }
  return Tools.CreateUserSession(user);
};
exports.RegisterTeam = async (email, password, firstName, lastName) => {
  return Tools.RegisterCore(
    email,
    password,
    firstName,
    lastName,
    Constants.UserRole.Team
  );
};
exports.RegisterVendor = (email, password, firstName, lastName) => {
  return Tools.RegisterCore(
    email,
    password,
    firstName,
    lastName,
    Constants.UserRole.Vendor
  );
};
exports.Login = (user) => {
  return Tools.CreateUserSession(user);
};
exports.Logout = (token) => {
  redisClient.del(token);

  return Promise.resolve({
    token: token,
    login: false
  });
};

exports.OAuth = async (provider, token) => {
  if (!provider || !token) {
    return Promise.reject(new Error('Provider, Token is required'));
  }
  return Tools.RegisterOAuth(provider, token)
    .then(userModel => Tools.CreateUserSession(userModel));
};
exports.OAuthCallback = (provider, query) => {
  return Promise.resolve({
    data: 'ok',
    provider: provider,
    query: query
  });
};

/*
      ========= [ PASSWORD ] =========
      */
exports.ValidatePassword = async (user, password) => {
  return UserService.Validate.Password(user._id, password);
};
exports.ChangePassword = (user, oldPassword, newPassword) => {
  return exports.ValidatePassword(user, oldPassword)
    .then(isMatch => {
      if (!isMatch) {
        return Promise.reject(new Error('Invalid Old Password.'));
      }
      return UserService.ModifyUser.Password(user.email, newPassword);
    });
};
exports.RequestForgotPasswordToken = async (email) => {
  const genToken = await Tools.GenerateToken.Recovery();
  await UserService.SaveToken.ForgotPassword(email, genToken, Util.AddSeconds(Date.now(), Config.account.tokenExpiry.resetPassword));
  return Tools.SendTokenEmail(email, genToken, 'Password Recovery');
};
exports.ResetWithToken = (email, token, password) => {
  return UserService.Validate.ChangeForgotPasswordWithToken(token, password);
};
exports.ResetByAdmin = (email, password) => {
  return Tools.ChangePasswordCore(email, password);
};

/*
========= [ ACCOUNT ] =========
*/
exports.VerifyEmail = (token) => {
  return UserService.Validate.VerifyEmail(token);
};
exports.ChangeRole = (userId, newRole) => {
  return UserService.ModifyUser.Role(userId, newRole);
};
exports.ChangeStatus = (userId, newStatus) => {
  return UserService.ModifyUser.Status(userId, newStatus);
};
exports.SuspendAccount = (userId) => {
  return UserService.ModifyUser.Suspend(userId);
};
