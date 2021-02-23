const express = require("express");
const router = express.Router();
const _ = require('lodash');
const{Comment,validateComment} = require('../models/comment');
const{User, validateUser} = require('../models/user');


//Async function for creating Comment
router.post('/',async(req, res) => {
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


//Retrieving all comments by BLOG
router.get('/by-blog/:id', async(req, res) => {
    const comments = await Comment.find({blog:req.params.id});
    let reqBlogId = req.params.id;
    if(!comments) return res.status(404).send(`There are NO comments for Blog with ID : ${reqBlogId}`);
    res.send(comments);
})


//Retrieving all comments by USER
router.get('/by-user/:id',async(req, res) => {
    const comments = await Comment.find({"user._id":req.params.id});
    let reqUserId = req.params.id;
    if(!comments) return res.status(404).send(`There are NO comments from User with ID : ${reqUserId}`);
    res.send(comments);
})

//Retrieving all comments
router.get('/', async(req, res) => {
    const comments = await Comment.find().sort('blog');
    res.send(comments);
})


router.delete('/:id',async(req, res) => {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    let reqCommentId = req.params.id;
    if(!comment) return res.status(404).send(`Blog with ID : ${reqCommentId} was not found!`);
    res.send(comment);
})



module.exports=router;
