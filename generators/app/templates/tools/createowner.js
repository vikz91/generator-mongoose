'use strict';

// Module dependencies.
const mongoose = require('mongoose');
const User = mongoose.models.User;
const Constants = require('../library').Constants;
const Util = require('../library').Util;
const debug = require('debug')('Tools:Seed');

const API = {};

API.Run = async () => {
  Util.PrintTitle('Running CreateOwnerUser ...');

  return API.CreateOwnerUser().then(x => {
    return 'Created Owner with email ' + x.email;
  });
};

API.CreateOwnerUser = async () => {
  debug('Creating Owner User');
  const usr = new User({
    email: 'admin@<%= hostUrl%>',
    password: '@abcd1234',
    profile: {
      firstName: 'Admin',
      lastName: '<%= capName %>'
    },
    role: Constants.UserRole.Owner
  });

  return usr.save();
};

module.exports = API;
