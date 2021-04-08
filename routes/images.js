const express = require('express');
const router = express.Router();
const multer = require("multer");
const authorization = require("../middleware/authorization");
const {Upload,getImagesFromDirectory} = require('../models/image');
const administration = require("../middleware/administration");

//Post request for uploading images to Gallery folder - no token needed.
//Because of the case of User registration.
router.post('/',(req, res) => {
    Upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)
    });
})

//Retrieving all the Images from gallery - admin rights only.
router.get('/',[authorization,administration],(req, res) => {
    let images = getImagesFromDirectory( 'gallery');
    res.send(images);
})

module.exports = router;
