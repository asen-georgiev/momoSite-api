const express = require("express");
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const authorization = require("../middleware/authorization");
const administration = require("../middleware/administration");
const{Admin,validateAdmin} = require('../models/admin');



//Showing the current Admin user - admin rights only
router.get('/adm', [authorization,administration], async (req, res) => {
    const admin = await Admin.findById(req.user._id).select('-password');
    res.send(admin);
})



//Creating Admin object - admin rights only
router.post('/',[authorization,administration],async(req, res) => {
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
    const token = admin.generateAdminToken();
    res.header('x-auth-token',token).send(token);
})



//Retrieving all Admin users from DB - admin rights only
router.get('/',[authorization,administration],async (req, res) => {
    const admins = await Admin.find().sort('adminName');
    res.send(admins);
})


//Retrieving single Admin user by ID - admin rights only
router.get('/:id',[authorization,administration],async (req, res) => {
    const admin = await Admin.findById(req.params.id);
    if(!admin) return res.status(404).send('Admin with the given ID was not found!');
    res.send(admin);
})


//Updating single Admin object - admin rights only
router.put('/:id',[authorization,administration],async (req, res) => {
    const {error} = validateAdmin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const salt = await bcrypt.genSalt(10);

    const admin = await Admin.findByIdAndUpdate(req.params.id,{
        adminName: req.body.adminName,
        adminEmail: req.body.adminEmail,
        adminPassword: await bcrypt.hash(req.body.adminPassword,salt),
        isAdmin: req.body.isAdmin
    },
        {new:true});

    if(!admin) return res.status(404).send("The admin with the given ID was not found!");
    res.send(admin);
})


//Deleting single Admin object - admin right only
router.delete('/:id',[authorization,administration],async (req, res) => {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if(!admin) return res.status(404).send('Admin with the given ID was not found!');
    res.send(admin);
})



module.exports=router;
