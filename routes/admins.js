const express = require("express");
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const{Admin,validateAdmin} = require('../models/admin');



//Async function for creating Admin
router.post('/',async(req, res) => {
    //Validating the input data by the JOI function
    const {error} = validateAdmin(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking in the DB if there is Admin registered with the same email
    let admin = await Admin.findOne({adminEmail: req.body.adminEmail});
    const reqEmail = req.body.adminEmail;
    if(admin) return res.status(409).send(`Admin with adminEmail: ${reqEmail} already exists!`);

    //Creating new Admin object
    admin = new Admin(_.pick(req.body,['adminName','adminEmail','adminPassword','isAdmin']));

    //Generating SALT from Bcrypt and hashing the password in the DB
    const salt = await bcrypt.genSalt(10);
    admin.adminPassword = await bcrypt.hash(admin.adminPassword,salt);

    //Saving the Admin object in DB
    await admin.save();

    //If admin is successfully registered we are returning token in the header
    const token = admin.generateAuthToken();
    res.header('x-auth-token',token).send(_.pick(admin,['_id','adminName','adminEmail','isAdmin']));
})

module.exports=router;
