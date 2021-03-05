const mongoose = require('mongoose');
const Joi = require("joi");

const bioSchema = new mongoose.Schema({
    bioTitle: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    bioText: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1024
    },
    bioPictures: {
        type: [String],
        required: true
    }
})

const Bio = mongoose.model('Bio',bioSchema);

function validateBio(bio){
    const schema = Joi.object({
        bioTitle: Joi.string().required().min(5).max(100),
        bioText: Joi.string().required().min(10).max(1024),
        bioPictures: Joi.array().items(Joi.string().required()).required()
    });
    return schema.validate(bio);
}

exports.Bio = Bio;
exports.validateBio = validateBio;
exports.bioSchema = bioSchema;
