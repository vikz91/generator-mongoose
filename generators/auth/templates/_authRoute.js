'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
// const debug = require('debug')('App:API:auth')
const Config = require('../config');
const Util = require('../library').Util;
const Constants = require('../library').Constants;

const ApiModule = 'auth';
const Service = require('../apiObjects/auth');

// Middleware to require login/auth
const routeSanity = require('../middleware/routeSanity');
const rbac = require('../middleware').RBAC;
const requireLogin = passport.authenticate('local', { session: false });

const Response = Util.Response;
const Execute = Util.ExecuteService;

/*
=====================[  ROUTE API  : CORE ]=====================
*/
// Core Operations
const API = {
  Check: async (req, res) => {
    const result = await Execute(Service.Check(req.user));
    res.status(200).json(Response(result.err, result.data));
  },

  Register: async (req, res) => {
    const data = req.body.data;
    if (!data.email || !data.password || !data.firstName) {
      return res.status(402).json(Response('Invalid Params Given', 'email password and firstName is required'));
    }
    const result = await Execute(Service.Register(data.email, data.password, data.firstName, data.lastName));
    res.status(201).json(Response(result.err, result.data));
  },
  RegisterVendor: async (req, res) => {
    const data = req.body.data;
    if (!data.email || !data.password || !data.firstName) {
      return res.status(402).json(Response('Invalid Params Given', 'email password and firstName is required'));
    }
    const result = await Execute(Service.RegisterVendor(data.email, data.password, data.firstName, data.lastName));
    res.status(201).json(Response(result.err, result.data));
  },
  RegisterTeam: async (req, res) => {
    const data = req.body.data;
    if (!data.email || !data.password || !data.firstName) {
      return res.status(402).json(Response('Invalid Params Given', 'email password and firstName is required'));
    }
    const result = await Execute(Service.RegisterTeam(data.email, data.password, data.firstName, data.lastName));
    res.status(201).json(Response(result.err, result.data));
  },

  Login: async (req, res) => {
    const result = await Execute(Service.Login(req.user));
    res.status(200).json(Response(result.err, result.data));
  },
  Logout: async (req, res) => {
    const result = await Execute(Service.Logout(req.get('Authorization')));
    res.status(200).json(Response(result.err, result.data));
  },

  OAuth: async (req, res) => {
    const data = req.body.data;
    if (!data.provider || !data.token) {
      return res.status(402).json(Response('Invalid Params Given', 'provider and token is required'));
    }
    const result = await Execute(Service.OAuth(data.provider, data.token));
    res.status(200).json(Response(result.err, result.data));
  },
  OAuthCallback: async (req, res) => {
    const result = await Execute(Service.OAuthCallback(req.params.provider, req.query));
    res.status(200).json(Response(result.err, result.data));
  },
  OAuthEmbed: (req, res) => {
    res.render('login', { title: 'yoyo' });
  }
};

/*
=====================[  ROUTE API  : PASSWORD ]=====================
*/
const APIPassword = {
  Validate: async (req, res) => {
    const result = await Execute(Service.ValidatePassword(req.user, req.body.data.password));
    res.status(200).json(Response(result.err, result.data));
  },
  Change: async (req, res) => {
    const result = await Execute(Service.ChangePassword(req.user, req.body.data.old, req.body.data.new));
    res.status(200).json(Response(result.err, result.data));
  },

  RequestForgotPasswordToken: async (req, res) => {
    const result = await Execute(Service.RequestForgotPasswordToken(req.params.email));
    res.status(200).json(Response(result.err, result.data));
  },
  ResetWithToken: async (req, res) => {
    if (!req.body.data.password) {
      return res.status(422).json(Response('Invalid Params Given', ' password  is required'));
    }
    const result = await Execute(Service.ResetWithToken(req.params.email, req.params.token, req.body.data.password));
    res.status(200).json(Response(result.err, result.data));
  },
  ResetByAdmin: async (req, res) => {
    const result = await Execute(Service.ResetByAdmin(req.params.email, req.body.data.password));
    res.status(200).json(Response(result.err, result.data));
  }
};

/*
=====================[  ROUTE API  : ACCOUNT ]=====================
*/
const APIAccount = {
  VerifyEmail: async (req, res) => {
    const result = await Execute(Service.VerifyEmail(req.params.token));
    res.status(200).json(Response(result.err, result.data));
  },

  ChangeRole: async (req, res) => {
    const role = req.body.data.role;
    if (Config.auth.roles.indexOf(role) < 0) {
      return res.status(422).json(Response('Invalid Role Assigned!', role, 'Change the role to what is specified in the server'));
    }
    const result = await Execute(Service.ChangeRole(req.params.userid, role));
    res.status(200).json(Response(result.err, result.data));
  },
  ChangeStatus: async (req, res) => {
    const status = req.body.data.status;
    if (Object.values(Constants.Status).indexOf(status) < 0) {
      return res.status(422).json(Response('Invalid Status updated!', status, 'Change the status to what is specified in the server'));
    }
    const result = await Execute(Service.ChangeStatus(req.params.userid, status));
    res.status(200).json(Response(result.err, result.data));
  },
  SuspendAccount: async (req, res) => {
    const result = await Execute(Service.SuspendAccount(req.params.userid));
    res.status(200).json(Response(result.err, result.data));
  }
};

// ================================[  ROUTES  ]================================

/*
=====================[  ROUTE : CORE ]=====================
*/
router.get(`/${ApiModule}/check`, API.Check);
router.post(`/${ApiModule}/register`, routeSanity.checkData, API.Register);
router.post(`/${ApiModule}/register/team`, rbac.AuthorizeAdmin, routeSanity.checkData, API.RegisterTeam);
router.post(`/${ApiModule}/register/vendor`, rbac.AuthorizeAdmin, routeSanity.checkData, API.RegisterVendor);

router.post(`/${ApiModule}/login`, requireLogin, API.Login);
router.post(`/${ApiModule}/logout`, API.Logout);

router.post(`/${ApiModule}/login/oauth`, API.OAuth);
router.get(`/${ApiModule}/login/oauth/:provider/callback`, API.OAuthCallback);
router.get(`/${ApiModule}/login/oauth/embed`, API.OAuthEmbed);
/*
=====================[  ROUTE : PASSWORD ]=====================
*/
router.post(`/${ApiModule}/password/validate`, APIPassword.Validate);
router.post(`/${ApiModule}/password/change`, routeSanity.checkData, APIPassword.Change);
router.get(`/${ApiModule}/password/forgot/:email`, APIPassword.RequestForgotPasswordToken);
router.post(`/${ApiModule}/password/forgot/:email/:token`, APIPassword.ResetWithToken);
router.post(`/${ApiModule}/password/change/:email/admin`, rbac.AuthorizeAdmin, APIPassword.ResetByAdmin);

/*
=====================[  ROUTE : ACCOUNT ]=====================
*/
router.get(`/${ApiModule}/account/verify/:token`, APIAccount.VerifyEmail);
router.post(`/${ApiModule}/account/:userid/role`, rbac.AuthorizeAdmin, routeSanity.checkId('userid'), routeSanity.checkData, APIAccount.ChangeRole);
router.post(`/${ApiModule}/account/:userid/status`, rbac.AuthorizeAdmin, routeSanity.checkId('userid'), routeSanity.checkData, APIAccount.ChangeStatus);
router.post(`/${ApiModule}/account/:userid/suspend`, rbac.AuthorizeAdmin, routeSanity.checkId('userid'), APIAccount.SuspendAccount);

module.exports = router;
