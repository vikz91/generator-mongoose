'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const Config = require('../config');
const Util = require('../library').Util;
const Constants = require('../library').Constants;

const AddressSchema = new Schema({
  label: String, // home,work
  primary: {
    type: Boolean,
    default: false
  },
  address: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    }
  }
});

const PhoneSchema = new Schema({
  label: String, // home,work
  primary: {
    type: Boolean,
    default: false
  },
  countrycode: String,
  phone: Number
});

const OAuthSchema = new Schema({
  provider: {
    type: String,
    enum: Object.keys(Constants.OAuthProviders).map(x => Constants.OAuthProviders[x]),
    default: Constants.OAuthProviders.Local
  },
  oAuthUserId: {
    type: String
  }
});

//= ===============================
// User Schema
//= ===============================
const ModelSchema = new Schema({
  auth: [OAuthSchema],
  oAuthAvatar: String,
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },

  profile: {
    firstName: String,
    lastName: String,
    dob: {
      type: Date,
      default: Date.now
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Transgender', 'Other'],
      default: 'Other'
    },
    bio: String
  },

  contact: {
    address: [AddressSchema],
    phone: [PhoneSchema],
    email: [String]
  },

  role: {
    type: String,
    enum: Config.auth.roles,
    default: Constants.UserRole.Customer
  },

  status: {
    type: String,
    enum: Object.values(Constants.Status),
    default: Constants.Status.Active
  },

  onboarding: {
    isOnboarded: { type: Boolean, default: false },
    finishedTutorial: { type: Boolean, default: false }
  },

  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  verifyEmailToken: {
    type: String
  },
  verifyEmailExpires: {
    type: Date
  }
}, {
  timestamps: true
});

// Pre-save of user to database, hash password if password is modified or new
ModelSchema.pre('save', function (next) {
  const user = this;

  const SALT_FACTOR = 5;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Method to compare password for login
ModelSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }

    cb(null, isMatch);
  });
};

ModelSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('profile')) return next();
  if (!user.profile.lastName || user.profile.lastName === 'undefined' || typeof user.profile.lastName === 'undefined') {
    user.profile.lastName = '';
  }
  user.profile.name = user.profile.firstName;
  next();
});

module.exports = mongoose.model('User', ModelSchema);
