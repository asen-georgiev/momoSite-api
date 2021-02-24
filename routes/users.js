const express = require("express");
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const authorization = require("../middleware/authorization");
const{User, validateUser} = require('../models/user');
const sendGrid = require("@sendgrid/mail");

const apiKey = process.env.SENDGRID_API_KEY;


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
    res.header('x-auth-token',token).send(token);
})


//Getting all the users
router.get('/',async (req, res) => {
    const users = await User.find().sort('userName');
    if(!users) return res.status(404).send("There are no Users registered in the DB!");
    res.send(users);
})


//Getting single user
router.get('/:id',async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).send('User with the given ID was not found!');
    res.send(user);
})


//Updating user by user and admin - only authorisation needed.
router.put('/:id', async (req, res) => {
    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const salt = await bcrypt.genSalt(10);

    const user = await User.findByIdAndUpdate(req.params.id,{
        userName : req.body.userName,
        userFamily : req.body.userFamily,
        userEmail : req.body.userEmail,
        userPassword : await bcrypt.hash(req.body.userPassword,salt),
        userPicture: req.body.userPicture,
        userAddress: req.body.userAddress,
        userTelephone: req.body.userTelephone
    },
        {new: true});

    if(!user) return res.status(404).send("The user with the given ID was not found");
    res.send(user);
})


//Updating password when the user is dumb enough to forget it
router.put('/pass/update', async(req, res) => {

    function makePass() {
        let password = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < 9; i++) {
            password += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return password;
    }

    const salt = await bcrypt.genSalt(10);

    const newPassword = makePass();
    const password = await bcrypt.hash(newPassword,salt);

    const user = await User.findOneAndUpdate({userEmail: req.body.userEmail},{
        $set: {userPassword: password}},{new:true})

    sendGrid.setApiKey(apiKey);
    const msg = {
        to: req.body.userEmail,
        from: "empyrean1981@abv.bg",
        subject: "Recover password",
        text: "Thank you, for your e-mail, we will contact you soon!",
        html:`<div>
                <h5>Hello,</h5>
                <p>This is your new user password :</p>
                <span><b>${newPassword}</b></span>
                <p>Use the link below to go to our login page :</p>
                <span><a href="http://localhost:3000/userlogin">User login</a></span>
            </div>`
    };
    sendGrid
        .send(msg)
        .then(() => {
            console.log('Email sent successfully!');
            res.status(200).send(user);
        })
        .catch((error) => {
            res.status(401).send('There was an error sending the email through API.');
            console.log(error);
        });



    // if(!user) return res.status(404).send("test");
    // res.send(user);
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
