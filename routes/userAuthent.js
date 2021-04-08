const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const {User, validateUser} = require('../models/user');


//User authentication route - If the User object is Valid in DB -
//We return generated token back to Frontend.
router.post('/',async(req, res) => {
    //Function for validating the input data from the User login
    const {error} = validateUserAuthent(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Async req waiting for server response for the user email check
    let user = await User.findOne({userEmail: req.body.userEmail});
    if(!user) return res.status(401).send('Invalid user email!');

    //Async req waiting for BCRYPT to compare password from the input with the hashed one in DB
    const validPassword = await bcrypt.compare(req.body.userPassword,user.userPassword);
    if(!validPassword) return res.status(401).send('Invalid user password');

    //Function for generating token and returning to user
    const token = user.generateUserToken();
    res.header('x-auth-token',token).send(token);

})

//Function for Joi validation of the input
function validateUserAuthent(req){
    const schema = Joi.object({
        userEmail: Joi.string().required().min(5).max(50),
        userPassword: Joi.string().required().min(8).max(255)
    })
    return schema.validate(req);
}

module.exports = router;
