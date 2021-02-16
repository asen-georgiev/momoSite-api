const express = require("express");
const router = express.Router();
const _ = require('lodash');
const {Bio, validateBio} = require('../models/biography');



router.post('/', async(req, res) => {
    const {error} = validateBio(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let bio = await Bio.findOne({bioTitle: req.body.bioTitle});
    const reqBioTitle = req.body.bioTitle;
    if(bio) return res.status(409).send(`Biography with ${reqBioTitle} already exists`);

    bio = new Bio(_.pick(req.body,['bioTitle','bioText','bioPictures']));
    await bio.save();
    res.send(bio);
})



router.get('/', async(req, res) => {
    const bios = await Bio.find().sort('_id');
    res.send(bios);
})


router.get('/:id',async(req, res) => {
    const bio = await Bio.findById(req.params.id);
    if(!bio)return res.status(404).send('Biography with the given ID was not found!');
    res.send(bio);
})


router.put('/:id',async(req, res) => {
    const {error} = validateBio(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const bio = await Bio.findByIdAndUpdate(req.params.id,{
        bioTitle: req.body.bioTitle,
        bioText: req.body.bioText,
        bioPictures: req.body.bioPictures
    },{new:true});

    if(!bio) return res.status(404).send('Biography with the given ID was not found!');
})


router.delete('/:id', async(req, res) => {
    const bio = await Bio.findByIdAndDelete(req.params.id);
    let reqBioId = req.params.id;
    if(!bio) return res.status(404).send(`Biography with ID: ${reqBioId} was not found!`);
    res.send(bio);
})

module.exports=router;
