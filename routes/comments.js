const express = require("express");
const router = express.Router();
const _ = require('lodash');
const{Comment,validateComment} = require('../models/comment');
const{User, validateUser} = require('../models/user');
const authorization = require("../middleware/authorization");
const administration = require("../middleware/administration");


//Creating single Comment object - user rights only.
router.post('/',authorization,async(req, res) => {
    //Validating input data from JOI function
    const {error} = validateComment(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking for existing User
    const user = await User.findById(req.body.userId);
    if(!user) return res.status(404).send('There is no registered User with given ID!');

    //Creating Comment object
    let comment = new Comment({
        commentText: req.body.commentText,
        user:{
            _id: user._id,
            userName: user.userName,
            userFamily: user.userFamily,
            userEmail: user.userEmail,
            userPicture: user.userPicture,
            userPassword: user.userPassword,
            userAddress: user.userAddress,
            userTelephone: user.userTelephone
        },
        blog:req.body.blogId
    });

    await comment.save()
    res.send(_.pick(comment,['commentText','user.userName','user.userFamily','user.userPicture','blog']));
})


//Retrieving all comments by Blog ID - no token needed.
router.get('/by-blog/:id', async(req, res) => {
    const comments = await Comment.find({blog:req.params.id});
    let reqBlogId = req.params.id;
    if(!comments) return res.status(404).send(`There are NO comments for Blog with ID : ${reqBlogId}`);
    res.send(comments);
})


//Retrieving all comments by User ID - user rights only.
router.get('/by-user/:id',authorization,async(req, res) => {
    const comments = await Comment.find({"user._id":req.params.id});
    let reqUserId = req.params.id;
    if(!comments) return res.status(404).send(`There are NO comments from User with ID : ${reqUserId}`);
    res.send(comments);
})

//Retrieving all the Comment objects fom DB - admin rights only.
router.get('/',[authorization,administration],async(req, res) => {
    const comments = await Comment.find().sort('blog');
    res.send(comments);
})


//Deleting single Comment object from DB - authorization only.
router.delete('/:id',authorization,async(req, res) => {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    let reqCommentId = req.params.id;
    if(!comment) return res.status(404).send(`Blog with ID : ${reqCommentId} was not found!`);
    res.send(comment);
})


module.exports=router;
