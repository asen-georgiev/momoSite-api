const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const config = require("config");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        // required: true,
        minlength: 3,
        maxlength: 30
    },
    userFamily: {
        type: String,
        // required: true,
        minlength: 3,
        maxlength: 30
    },
    userPassword: {
        type: String,
        // required: true,
        minlength: 8,
        maxlength: 1024
    },
    userEmail: {
        type: String,
        // required: true,
        minlength: 5,
        maxlength: 50
    },
    userPicture: {
        type: String,
        // required: true,
        minlength: 5,
        maxlength: 100
    },
    userAddress: {
        type: String,
        // required: true,
        minlength: 5,
        maxlength: 100
    },
    userTelephone: {
        type: String,
        // required: true,
        minlength: 5,
        maxlength: 50
    }
})

//Generating auth token for the user
userSchema.methods.generateUserToken = function () {
    const token = jwt.sign({
            _id: this.id,
            userName: this.userName,
            userFamily: this.userFamily,
            userEmail: this.userEmail,
            userPicture: this.userPicture,
            userAddress: this.userAddress,
            userTelephone: this.userTelephone
        },
        config.get('jwtPrivateKey'));
    return token;
}

//Creating User by the userSchema;
const User = mongoose.model('User',userSchema);

//validating User input
function validateUser(user){
    const schema = Joi.object({
        userName: Joi.string().required().min(3).max(30),
        userFamily: Joi.string().required().min(3).max(30),
        userPassword: Joi.string().required().min(8).max(255),
        userEmail: Joi.string().required().min(5).max(50),
        userPicture: Joi.string().required().min(5).max(100),
        userAddress: Joi.string().required().min(5).max(100),
        userTelephone: Joi.string().required().min(5).max(50).pattern(new RegExp('^[\\+]?[0-9]?()[0-9](\\s|\\S)(\\d[0-9]{7,})$'))
    });
    return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
exports.userSchema = userSchema;
