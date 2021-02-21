const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const Joi = require("joi");
const{userSchema} = require('./user');

const commentSchema = new mongoose.Schema({
    commentText:{
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1000
    },
    user:{
        type: userSchema,
        required: true
    },
    blog: {
        type: ObjectId,
        required: true
    }
})

//Creating Comment by the commentSchema
const Comment = mongoose.model('Comment',commentSchema);

//validating Comment input
function validateComment(comment){
    const schema = Joi.object({
        commentText: Joi.string().required().min(10).max(1000),
        userId: Joi.objectId().required(),
        blogId: Joi.objectId().required()
    });
    return schema.validate(comment);
}

exports.Comment = Comment;
exports.validateComment = validateComment;
exports.commentSchema = commentSchema;

