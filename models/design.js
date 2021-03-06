const mongoose = require('mongoose');
const Joi = require("joi");

const designSchema = new mongoose.Schema({
    designTitle: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    designText: {
        type: String,
        maxlength: 200
    },
    designPictures: {
        type: [String],
        required: true
    },
    designType : {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    }
});

const Design = mongoose.model('Design',designSchema);

function validateDesign(design){
    const schema = Joi.object({
        designTitle: Joi.string().required().min(5).max(100),
        designText: Joi.string().allow('').min(10).max(200),
        designPictures: Joi.array().items(Joi.string().required()).required(),
        designType: Joi.string().required().min(3).max(30)
    });
    return schema.validate(design);
}

exports.Design = Design;
exports.validateDesign = validateDesign;
exports.designSchema = designSchema;
