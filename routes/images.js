const express = require('express');
const router = express.Router();
const multer = require("multer");
const authorization = require("../middleware/authorization");
const {Upload,getImagesFromDirectory} = require('../models/image');

//Post request for uploading images to Gallery folder
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

//Get request for retrieving images from gallery
router.get('/',(req, res) => {
    let images = getImagesFromDirectory( 'gallery');
    res.send(images);
})

module.exports = router;
