const express = require("express");
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const authorization = require("../middleware/authorization");
const{Admin,validateAdmin} = require('../models/admin');



//Showing the current admin user
router.get('/adm', authorization, async (req, res) => {
    const admin = await Admin.findById(req.user._id).select('-password');
    res.send(admin);
})



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
    const token = admin.generateAdminToken();
    res.header('x-auth-token',token).send(_.pick(admin,['_id','adminName','adminEmail','isAdmin']));
})



//Retrieving all admin users from DB
router.get('/',async (req, res) => {
    const admins = await Admin.find().sort('adminName');
    res.send(admins);
})


//Retrieving single admin user by ID
router.get('/:id',async (req, res) => {
    const admin = await Admin.findById(req.params.id);
    if(!admin) return res.status(404).send('Admin with the given ID was not found!');
    res.send(admin);
})


router.put('/:id',async (req, res) => {
    const {error} = validateAdmin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const salt = await bcrypt.genSalt(10);

    const admin = await Admin.findByIdAndUpdate(req.params.id,{
        adminName: req.body.adminName,
        adminEmail: req.body.adminEmail,
        adminPassword: req.body.adminPassword,
        isAdmin: req.body.isAdmin
    },
        {new:true});

    if(!admin) return res.status(404).send("The admin with the given ID was not found!");
    res.send(admin);
})


router.delete('/:id', async (req, res) => {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if(!admin) return res.status(404).send('Admin with the given ID was not found!');
    res.send(admin);
})



module.exports=router;
