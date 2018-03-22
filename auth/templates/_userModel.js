'use strict';

var mongoose=require('mongoose'),
Schema=mongoose.Schema,
bcrypt=require('bcrypt-nodejs');

const AddressSchema = new Schema({ 
  label:String, //home,work
  primary:{type:Boolean,default:false},
  address:{
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
  label:String, //home,work
  primary:{type:Boolean,default:false},
  countrycode:String,
  phone:Number
}); 

//================================
// User Schema
//================================
const UserSchema = new Schema({  
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  
  profile: {
    firstName: { type: String },
    lastName: { type: String },
    name: { type: String },
    dob: { type: Date , default: Date.now },
    gender:{
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male'
    }
  },
  
  contact:{
    address:[AddressSchema],
    phone:[PhoneSchema],
    email:[String]
  },
  
  role: {
    type: String,
    enum: ['Admin', 'Manager', 'Member' ],
    default: 'Member'
  },
  
  status: {
    type: String,
    enum: ['active', 'pending', 'suspended', 'closed'],
    default: 'active'
  },
  
  
  description:String,
  
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
},
{
  timestamps: true
});



// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function(next) {  
  const user = this,
  SALT_FACTOR = 5;
  
  if (!user.isModified('password')){ return next();}
  
  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) {return next(err);}
    
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {return next(err);}
      user.password = hash;
      next();
    });
  });
});



UserSchema.pre('save', function(next) {
  const user = this;
  
  if (!user.isModified('profile')) {return next();}
  
  user.profile.name = user.profile.firstName + ' ' + user.profile.lastName;
  next();
});



// Method to compare password for login
UserSchema.methods.comparePassword = function(candidatePassword, cb) {  
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return cb(err); }
    
    cb(null, isMatch);
  });
};


module.exports = mongoose.model('User', UserSchema);  