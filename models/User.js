const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true,'Please fill your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        validate:[validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required:[true, 'please provide a password!'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            //the current element which is passwordConfirm equal to password
            validator: function(el){
                return el === this.password;
            },
            message: "passwords are not the same"
        }
    }
});

userSchema.pre('save',async function(next){
    //only run this function if the password was modified , it will hash the password twice otherwise
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,10)
    this.passwordConfirm = undefined;
});


module.exports = mongoose.model("User",userSchema);