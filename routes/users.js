const express = require("express");
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const authorization = require("../middleware/authorization");
const{User, validateUser} = require('../models/user');


//Async function for creating User
router.post('/',async(req, res) => {
    //Validating input data from JOI function
    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking in the DB if there is already registered user with this email
    let user = await User.findOne({userEmail: req.body.userEmail});
    const reqEmail = req.body.userEmail;
    if(user) return res.status(409).send(`User with an email: ${reqEmail} already exists!`);

    //Creating User object
    user = new User(_.pick(req.body,
        ['userName','userFamily','userEmail','userPassword','userPicture','userAddress','userTelephone']));

    //Generating salt from bcrypt
    const salt = await bcrypt.genSalt(10);
    user.userPassword = await bcrypt.hash(user.userPassword,salt);

    //Saving User object in Db
    await user.save();

    //If User is successfully registered we are returning token in the header
    const token = user.generateUserToken();
    res.header('x-auth-token',token).send(_.pick(user,
        ['userName','userFamily','userEmail','userPicture','userAddress','userTelephone']));
})


router.get('/',async (req, res) => {
    const users = await User.find().sort('userName');
    if(!users) return res.status(404).send("There are no Users registered in the DB!");
    res.send(users);
})


router.get('/:id',async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).send('User with the given ID was not found!');
    res.send(user);
})


router.put('/:id', async (req, res) => {
    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const salt = await bcrypt.genSalt(10);

    const user = await User.findByIdAndUpdate(req.params.id,{
        userName : req.body.userName,
        userFamily : req.body.userFamily,
        userEmail : req.body.userEmail,
        userPassword : req.body.userPassword,
        userPicture: req.body.userPicture,
        userAddress: req.body.userAddress,
        userTelephone: req.body.userTelephone
    },
        {new: true});

    if(!user) return res.status(404).send("The use with the given ID was not found");
    res.send(user);
})


router.delete('/:id', async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) return res.status(404).send('User with the given ID was not found!');
    res.send(user);
})


router.get('/usr', authorization,async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
})


module.exports=router;
