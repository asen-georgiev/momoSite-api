const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const config = require("config");

const adminSchema = new mongoose.Schema({
    adminName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    adminEmail: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    adminPassword: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean
    }
});

//Generating Auth token
adminSchema.methods.generateAdminToken = function () {
    const token = jwt.sign({
            _id: this._id,
            adminName: this.adminName,
            isAdmin: this.isAdmin
        },
        config.get('jwtPrivateKey'));
    return token;
}

//Creating Admin by the Admin schema
const Admin = mongoose.model('Admin', adminSchema);

//Validating Admin input
function validateAdmin(admin) {
    const schema = Joi.object({
        adminName: Joi.string().required().min(5).max(50),
        adminEmail: Joi.string().required().min(5).max(50),
        adminPassword: Joi.string().required().min(8).max(255),
        isAdmin: Joi.boolean().required()
    });
    return schema.validate(admin);
}

exports.Admin = Admin;
exports.validateAdmin = validateAdmin;
exports.adminSchema = adminSchema;
