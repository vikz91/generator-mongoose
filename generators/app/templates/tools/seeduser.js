'use strict';

// Module dependencies.
const mongoose = require('mongoose');
const User = mongoose.models.User;
const Constants = require('../library').Constants;
const Util = require('../library').Util;
const debug = require('debug')('Tools:Seed');

const API = {};

API.Run = async () => {
  Util.PrintTitle('Running Seed ...');

  return API.CreateTestCustomer().then(() => {
    return 'Created test customers ';
  });
};

API.CreateTestCustomer = async () => {
  debug('Creating Owner User');

  const fakeUsers = ['Customer 1', 'Customer 2', 'Customer 3'];
  for await (const fakeUser of fakeUsers) {
    const user = new User({
      email: `${fakeUser.toLowerCase().replace(' ', '')}@test.com`,
      password: '  ',
      profile: {
        firstName: fakeUser,
        lastName: 'Test'
      },
      role: Constants.UserRole.Customer
    });
    await user.save();
  }
};

module.exports = API;
