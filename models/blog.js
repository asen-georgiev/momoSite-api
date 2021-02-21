const mongoose = require('mongoose');
const Joi = require("joi");

const blogSchema = new mongoose.Schema({
    blogTitle: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    blogSubTitle: {
        type: String,
        minlength:5,
        maxlength: 100,
        required: true
    },
    blogText: {
        type: String,
        minlength: 20,
        maxlength: 2000,
        required: true
    },
    blogPictures: {
        type: [String]
    },
    blogLink: {
        type: String,
        maxlength: 50
    },
    blogDate: {
        type: Date,
        default: Date.now,
        required: true
    }
})

const Blog = mongoose.model('Blog', blogSchema);

function validateBlog(blog) {
    const schema = Joi.object({
        blogTitle: Joi.string().required().min(5).max(100),
        blogSubTitle: Joi.string().required().min(5).max(100),
        blogText: Joi.string().required().min(20).max(2000),
        blogPictures: Joi.array().items(Joi.string()).allow(''),
        blogLink: Joi.string().min(5).max(50).allow('')
    });
    return schema.validate(blog);
}

exports.Blog = Blog;
exports.validateBlog = validateBlog;
exports.blogSchema = blogSchema;
