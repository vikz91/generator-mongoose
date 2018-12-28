'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');

const AddressSchema = new Schema({
    label: String, //home,work
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
    label: String, //home,work
    primary: {
        type: Boolean,
        default: false
    },
    countrycode: String,
    phone: Number
});

//================================
// User Schema
//================================
const ModelSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        mutable: false,
        search: true
    },
    password: {
        type: String,
        required: true,
        mutable: false,
        search: false
    },

    profile: {
        firstName: {
            type: String,
            mutable: true,
            search: true
        },
        lastName: {
            type: String,
            mutable: true,
            search: true
        },
        dob: {
            type: Date,
            default: Date.now,
            mutable: true,
            search: true
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
            default: 'Male',
            mutable: true,
            search: true
        },
    },

    contact: {
        address: [AddressSchema],
        phone: [PhoneSchema],
        email: [String]
    },

    role: {
        type: String,
        enum: ['Admin', 'Manager', 'Member'],
        default: 'Member',
        mutable: false,
        search: true
    },

    status: {
        type: String,
        enum: ['active', 'pending', 'suspended', 'closed'],
        default: 'active',
        mutable: false,
        search: true
    },

    description: {
        type: String,
        mutable: true,
        search: true
    },

    resetPasswordToken: {
        type: String,
        mutable: false,
        search: true
    },
    resetPasswordExpires: {
        type: Date,
        mutable: false,
        search: true
    }
}, {
    timestamps: true
});

// Pre-save of user to database, hash password if password is modified or new
ModelSchema.pre('save', function (next) {
    const user = this,
        SALT_FACTOR = 5;

    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, null, function (err, hash) {
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


ModelSchema.statics.GetFieldsByOption = function (fieldOptionName) {
    return Object.keys(this.schema.paths).filter(fld =>
        this.schema.paths[fld].options[fieldOptionName]
    );
};

module.exports = mongoose.model('User', ModelSchema);
