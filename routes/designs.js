const express = require("express");
const router = express.Router();
const _ = require('lodash');
const {Design, validateDesign} = require("../models/design");


router.post('/', async (req, res) => {
    const {error} = validateDesign(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    let design = await Design.findOne({designTitle: req.body.designTitle});
    const reqDesignTitle = req.body.designTitle;
    if (design) return res.status(409).send(`Design with title : ${reqDesignTitle} already exists!`);

    design = new Design(_.pick(req.body, ['designTitle', 'designText', 'designPictures','designType']));
    await design.save();
    res.send(design);
})


router.get('/', async (req, res) => {
    const designs = await Design.find();
    res.send(designs);
})


router.get('/:id', async (req, res) => {
    const design = await Design.findById(req.params.id);
    if (!design) return res.status(404).send('Design with the given ID was not found!');
    res.send(design);
})


router.put('/:id', async (req, res) => {
    const {error} = validateDesign(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const design = await Design.findByIdAndUpdate(req.params.id, {
        designTitle: req.body.designTitle,
        designText: req.body.designText,
        designPictures: req.body.designPictures,
        designType: req.body.designType
    }, {new: true});

    if (!design) return res.status(404).send('Design with the given ID was not found!');
})


router.delete('/:id', async (req, res) => {
    const design = await Design.findByIdAndDelete(req.params.id);
    let reqDesignId = req.params.id;
    if (!design) return res.status(404).send(`Design with ID : ${reqDesignId} was not founf!`);
    res.send(design);
})


module.exports = router;
