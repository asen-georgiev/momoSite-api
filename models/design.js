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
        minlength: 10,
        maxlength: 100
    },
    designPictures: {
        type: [String],
        required: true
    }
});

const Design = mongoose.model('Design',designSchema);

function validateDesign(design){
    const schema = Joi.object({
        designTitle: Joi.string().required().min(5).max(100),
        designText: Joi.string().allow('').min(10).max(100),
        designPictures: Joi.array().items(Joi.string())
    });
    return schema.validate(design);
}

exports.Design = Design;
exports.validateDesign = validateDesign;
exports.designSchema = designSchema;
