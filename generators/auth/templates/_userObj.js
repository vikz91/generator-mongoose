'use strict';

// Module dependencies.
const mongoose = require('mongoose');
// const debug = require('debug')('App:ApiObject:item')
// const Util = require('../library').Util
const Model = mongoose.models.User;
const Constants = require('../library').Constants;
const Util = require('../library').Util;

const ModelOptions = {
  projection: ['_id', 'email', 'profile', 'role', 'status', 'contact'],
  mutable: ['auth', 'profile', 'contact', 'onboarding', 'resetPasswordToken', 'resetPasswordExpires'],
  search: ['auth', 'email', 'profile', 'contact', 'role', 'status', 'onboarding', 'resetPasswordToken', 'resetPasswordExpires']
};

/*
========= [ CORE METHODS ] =========
*/

// ALL
exports.ReadList = (listOptions, role, status) => {
  const res = {
    data: {},
    count: 0
  };

  const predicate = {};

  if (role !== 'all' && role !== null) {
    predicate.role = role;
  }

  if (status !== 'all' && status !== null) {
    predicate.status = status;
  }

  const projection = ModelOptions.projection.join(' ');

  // return Promise.reject(new Error('Fake Error')) // Quick Err Check

  return Model.find(predicate, projection)
    .limit(listOptions.limit)
    .skip(listOptions.skip)
    .sort({ createdAt: listOptions.sort })
    .exec()
    .then((list) => {
      res.data = list;
      return Model.countDocuments();
    })
    .then(count => {
      res.count = count;
      return res;
    });
};

// GET
exports.Read = (id) => {
  return Model.findOne({
    _id: id
  })
    .then(data => {
      if (!data) {
        return Promise.reject(new Error(404));
      }

      return data;
    });
};

// POST
exports.Create = (data) => {
  data = new Model(data);
  return data.save()
    .then(() => data.toObject());
};

// PUT
exports.Update = (id, updateData) => {
  const finalData = {};
  ModelOptions.mutable.forEach(prop => {
    if (typeof updateData[prop] !== 'undefined') {
      finalData[prop] = updateData[prop];
    }
  });

  return Model.findOneAndUpdate({
    _id: id
  }, {
    $set: finalData
  }, {
    new: true
  })
    .then(data => {
      return data.toObject() || null;
    }); // eo Model.findOneAndUpdate
};

// DELETE
// @TODO: Implement Cloud Storage Delete
exports.Delete = (id) => {
  return Model.deleteOne({
    _id: id
  }).then(() => {
    return 'The data got Deleted';
  });
};

// UPLOAD AVATAR
// @TODO: Implement Google Storage
exports.UploadAvatar = (id, file) => {
  const filename = id + '.jpg';
  const fileUri = file.destination + filename;
  //   fs.rename(req.file.path, fileUri, function (err) {
  //     if (err) {
  //       console.log('ERROR: ' + err)
  //       return res.status(500).json({ error: err })
  //     }

  //     return res.status(200).json({
  //       url: req.headers.host + '/' + Util.DIR_AVATAR + filename,
  //       path: fileUri
  //     })
  //   })
  return Promise.resolve();
};

/*
========= [ SEARCH METHODS ] =========
*/

// SEARCH
exports.Search = (listOptions, keywordObj, strict) => {
  let k = {};

  if (strict) {
    k = keywordObj;
  } else {
    Object.keys(keywordObj).forEach(key => {
      if (isNaN(keywordObj[key])) {
        k[key] = new RegExp(keywordObj[key], 'i');
      } else {
        k[key] = keywordObj[key];
      }
    });
  }

  return Model.find(k)
    .limit(listOptions.limit)
    .skip(listOptions.skip)
    .sort({ createdAt: listOptions.sort })
    .exec();
};

// SEARCH ADVANCED
// TODO: Create Generic LIbrary for Search (Util.Search)
exports.SearchAdvanced = (listOptions, data) => {
  const searchObj = [];

  ModelOptions.search.forEach(prop => {
    if (typeof data[prop] !== 'undefined') {
      // let negate = data[prop].negate || false;

      switch (data[prop].search) {
        case 'single':
          searchObj.push({
            [prop]: new RegExp(data[prop].value, 'i')
          });
          break;
        case 'range':
          searchObj.push({
            [prop]: {
              $gte: data[prop].value[0] || Number.MAX_SAFE_INTEGER
            }
          });

          searchObj.push({
            [prop]: {
              $lte: data[prop].value[1] || Number.MIN_SAFE_INTEGER
            }
          });
          break;
        case 'array':
          searchObj.push({
            [prop]: {
              $in: [].concat(data[prop].value)
            }
          });
          break;
      }
    }
  });

  // debug('Modelfields.search: %o', ModelOptions.search);
  // debug('data: %o', data);
  // debug('searchObj: %o', searchObj);

  if (!searchObj || searchObj.length === 0) {
    return Promise.resolve([]);
  }

  return Model.find({
    $and: searchObj
  })
    .skip(listOptions.skip)
    .limit(listOptions.limit)
    .sort({ createdAt: listOptions.sort })
    .exec();
};

exports.Exists = (email) => {
  return Model.findOne({
    email: email
  })
    .then(data => {
      return Promise.resolve(data);
    });
};

exports.UpdateOAuth = async (provider, tokenData) => {
  return Model.findOne({ email: tokenData.email })
    .then(user => {
      if (!user) {
        return Promise.reject(new Error('User not found!'));
      }

      const existingProviderProfile = user.auth.find((x) => x.provider === provider);
      if (existingProviderProfile) {
        user.auth.find((x) => x.provider === provider).oAuthUserId = tokenData.id;
      } else {
        user.auth.push({
          provider: provider,
          oAuthUserId: tokenData.id
        });
      }

      user.profile.firstName = tokenData.firstName;
      user.profile.lastName = tokenData.lastName;
      user.oAuthAvatar = tokenData.picture;

      return user.save().then(() => user.toObject());
    });
};

exports.ModifyUser = {
  FindEmail: async (emailId) => {
    return Model.findOne({ email: emailId }, '_id email profile status role')
      .then(data => {
        return data || null;
      });
  },
  Password: async (emailId, newPassword) => {
    const password = await Util.GenerateHash(newPassword);
    return Model.findOneAndUpdate({
      email: emailId
    }, {
      $set: { password: password }
    }, {
      new: true
    })
      .then(data => {
        if (!data) {
          throw new Error('User not found!');
        }
        return data._id || null;
      });
  },
  Role: (userId, newRole) => {
    return Model.findOneAndUpdate({
      _id: userId
    }, {
      $set: { role: newRole }
    }, {
      new: true
    })
      .then(data => {
        if (!data) {
          throw new Error('User not found!');
        }
        return data.role || null;
      });
  },
  Status: (userId, newStatus) => {
    return Model.findOneAndUpdate({
      _id: userId
    }, {
      $set: { status: newStatus }
    }, {
      new: true
    })
      .then(data => {
        if (!data) {
          throw new Error('User not found!');
        }
        return data.status || null;
      });
  },
  Suspend: (userId) => {
    return Model.findOneAndUpdate({
      _id: userId
    }, {
      $set: { status: Constants.Status.Suspended }
    }, {
      new: true
    })
      .then(data => {
        if (!data) {
          throw new Error('User not found!');
        }
        return data.status || null;
      });
  },
  Activate: (userId) => {
    return Model.findOneAndUpdate({
      _id: userId
    }, {
      $set: { status: Constants.Status.Active }
    }, {
      new: true
    })
      .then(data => {
        if (!data) {
          throw new Error('User not found!');
        }
        return data.status || null;
      });
  }
};

exports.Validate = {
  Password: async (userId, password) => {
    return Model.findOne({
      _id: userId,
      status: Constants.Status.Active
    })
      .then(user => {
        if (!user) {
          throw new Error('Cannot Validate unknown/Terminated/Suspended User!');
        }

        return new Promise((resolve, reject) => {
          return user.comparePassword(password, (err, isMatch) => {
            if (err) {
              return reject(new Error(err));
            }
            return resolve(isMatch);
          });
        });
      });
  },
  VerifyEmail: async (token) => {
    return Model.findOneAndUpdate({
      verifyEmailToken: token,
      verifyEmailExpires: {
        $gt: Date.now()
      },
      status: Constants.Status.Pending
    }, {
      $set: {
        status: Constants.Status.Active,
        verifyEmailToken: null,
        verifyEmailExpires: Date.now()
      }
    }, {
      new: true
    })
      .then(data => {
        if (!data) {
          throw new Error('Cannot Activate unknown/Terminated/Expired User!');
        }
        return data.toObject() || null;
      });
  },
  ChangeForgotPasswordWithToken: async (token, newPass) => {
    const pass = await Util.GenerateHash(newPass);
    const srchObj = {
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: Date.now()
      },
      status: Constants.Status.Active
    };

    return Model.findOneAndUpdate(srchObj, {
      $set: {
        password: pass,
        resetPasswordToken: null,
        resetPasswordExpires: Date.now()
      }
    }, {
      new: true
    })
      .then(data => {
        if (!data) {
          throw new Error('Cannot Change Password of unknown/Terminated/Expired User!');
        }
        return data.toObject() || null;
      });
  }
};

exports.SaveToken = {
  ForgotPassword: async (emailId, token, expires) => {
    return Model.findOneAndUpdate({
      email: emailId,
      status: Constants.Status.Active
    }, {
      $set: {
        resetPasswordToken: token,
        resetPasswordExpires: expires
      }
    }, {
      new: true
    }).then(data => {
      if (!data) {
        throw new Error('User not found!');
      }
      return data.toObject() || null;
    });
  },
  VerifyEmail: async (emailId, token, expires) => {
    return Model.findOneAndUpdate({
      email: emailId,
      status: Constants.Status.Pending
    }, {
      $set: {
        verifyEmailToken: token,
        verifyEmailExpires: expires
      }
    }, {
      new: true
    }).then(data => {
      if (!data) {
        throw new Error('User not found!');
      }
      return data.toObject() || null;
    });
  }
};
