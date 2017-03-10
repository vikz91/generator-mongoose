const jwt = require('jsonwebtoken'),  
  crypto = require('crypto'),
  User = require('../models/user'),
  l = require('../config/lib');

const redis=require('redis-serverclient');

function generateToken(user) {  
  return jwt.sign(user, l.config.jwtSecret, {
      expiresIn: 10080 // in seconds
    });
}


// Set user info from request
function setUserInfo(request) {  
  return {
    _id: request._id,
    name: request.profile.name,
    email: request.email,
    role: request.role,
  };
}




//========================================
// Login Route
//========================================
exports.login = function(req, res, next) {

  let userInfo = setUserInfo(req.user);

  //console.log('req.use: ',req.user);

  let token='JWT ' + generateToken(userInfo);

  redis.client.set(token,JSON.stringify(userInfo));

  res.status(200).json({
    token: token,
    user: userInfo
  });
};


//========================================
// Logout Route
//========================================
exports.logout=function (req,res,next) {
  var token=req.get('Authorization');
  redis.client.del(token);

  res.status(200).json({
    token:token,
    login:false
  });
}



//========================================
// Registration Route
//========================================
exports.register = function(req, res, next) {  
  // Check for registration errors
  const userData={};
  userData.email = req.body.email;
  userData.name = req.body.name;
  userData.password = req.body.password;


  // Return error if no password provided
  if (!userData.password) {
    return res.status(422).send({ error: 'You must enter a password.' });
  }

  new registerCore(userData,(err,data)=>{
    if(err){
      res.status(data.status).json({error:err});
    }

    res.status(data.status).json(data.data);

  });
};


var registerCore=function (userData,callback) {
  // Return error if no email provided
  if (!userData.email) {
    let msg='You must enter an email address.';
    return callback(msg,{status:422});
  }

  // Return error if full name not provided
  if (!userData.name ) {
    let msg='You must enter your full name.';
    return callback(msg,{status:422});
  }

  

  User.findOne({ email: userData.email }, function(err, existingUser) {
      if (err) { return next(err); }

      // If user is not unique, return error
      if (existingUser) {
        let msg='That email address is already in use.';
        return callback(msg,{status:422});
      }

      // If email is unique and password was provided, create account
      let user = new User({
        email:userData.email,
        password:userData.password,
        profile:{name:userData.name}
      });

      user.save(function(err, user) {
        if (err) { return next(err); }

        // Subscribe member to Mailchimp list
        // mailchimp.subscribeToNewsletter(user.email);

        // Respond with JWT if user was created

        let userInfo = setUserInfo(user);
        let token='JWT ' + generateToken(userInfo);

        redis.client.set(token,JSON.stringify(userInfo));

        return callback(false,{status:201,data:{
          token: token,
          user: userInfo
        }});
      });
  });
}



//========================================
// Authorization Middleware
//========================================

// Role authorization check
exports.roleAuthorization = function(role) {  
  return function(req, res, next) {
    const user = req.user;

    User.findById(user._id, function(err, foundUser) {
      if (err) {
        res.status(422).json({ error: 'No user was found.' });
        return next(err);
      }

      console.log('foundUser: ',foundUser+', role: '+role);

      // If user is found, check role.
      if (foundUser.role == role) {

        return next();
      }

      res.status(401).json({ error: 'You are not authorized to view this content.' });
      return next('Unauthorized');
    })
  }
}

