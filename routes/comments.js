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
        }
    });

    await comment.save()
    res.send(_.pick(comment,['commentText','user.userName','user.userFamily','user.userPicture']));
})

module.exports=router;
