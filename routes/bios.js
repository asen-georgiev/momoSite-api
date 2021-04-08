const express = require("express");
const router = express.Router();
const _ = require('lodash');
const {Bio, validateBio} = require('../models/biography');
const authorisation = require('../middleware/authorization');
const administration = require("../middleware/administration");


//Creating single Biography object - admin rights only.
router.post('/',[authorisation,administration], async(req, res) => {
    const {error} = validateBio(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let bio = await Bio.findOne({bioTitle: req.body.bioTitle});
    const reqBioTitle = req.body.bioTitle;
    if(bio) return res.status(409).send(`Biography with ${reqBioTitle} already exists.`);

    bio = new Bio(_.pick(req.body,['bioTitle','bioText','bioPictures']));
    await bio.save();
    res.send(bio);
})


//Retrieving all the Biogaphy objects from DB no token needed.
router.get('/', async(req, res) => {
    const bios = await Bio.find().sort('_id');
    res.send(bios);
})

//Retrieving single Biography object from DB no token needed.
router.get('/:id',async(req, res) => {
    const bio = await Bio.findById(req.params.id);
    if(!bio)return res.status(404).send('Biography with the given ID was not found!');
    res.send(bio);
})


//Updating single Biography object - admin rights only.
router.put('/:id',[authorisation,administration],async(req, res) => {
    const {error} = validateBio(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const bio = await Bio.findByIdAndUpdate(req.params.id,{
        bioTitle: req.body.bioTitle,
        bioText: req.body.bioText,
        bioPictures: req.body.bioPictures
    },{new:true});

    if(!bio) return res.status(404).send('Biography with the given ID was not found!');
})


//Deleting single Biography object - admin rights only.
router.delete('/:id',[authorisation,administration],async(req, res) => {
    const bio = await Bio.findByIdAndDelete(req.params.id);
    let reqBioId = req.params.id;
    if(!bio) return res.status(404).send(`Biography with ID: ${reqBioId} was not found!`);
    res.send(bio);
})

module.exports=router;
