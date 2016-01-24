// Module dependencies.
var express = require('express'),
router = express.Router(),
user = require('../apiObjects/user');

var api = {};
// ALL
api.users = function (req, res) {
  user.getAllUsers(function(err,users){
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json({users: users});
    }
  }); 
};

// GET
api.user = function (req, res) {
  var id = req.params.id;
  user.getUser(id,function(err,user){
    if (err) {
      res.status(404).json(err);
    } else {
      res.status(200).json({user: user});
    }
  }); 
};

// PUT
api.editUser = function (req, res) {
  var id = req.params.id;

  return user.editUser(id,req.body.user, function (err, user) {
    if (!err) {
      console.log("updated user");
      return res.status(200).json(user.toObject());
    } else {
     return res.status(500).json(err);
   }
   return res.status(200).json(user);   
 });

};

// DELETE
api.deleteUser = function (req, res) {
  var id = req.params.id;
  return user.deleteUser(id, function (err, user) {
    if (!err) {
      console.log("removed user");
      return res.status(204).send();
    } else {
      console.log(err);
      return res.status(500).json(err);
    }
  });
};


//Authentication
//Initiate Login
api.login = function (req, res) {

  //STRUCTURE
  /*
  user:{
    username:"<SOME_USER_NAME>",
    token:"<FACEBOOK_AUTH_TOKEN>"
  }

  */

  var usr=req.body.user;

  user.login(usr.username,usr.token,function(err,user){
   if(err){
    res.status(500).json({msg:'Oops! Something Happened!',err:err});
  }else{
   res.status(200).json(user);
 }
});

};

router.post('/login',api.login);
router.get('/users', api.users);

router.route('/user/:id')
.get(api.user)
.put(api.editUser)
.delete(api.deleteUser);


module.exports = router;
