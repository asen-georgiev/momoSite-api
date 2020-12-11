const multer = require("multer");
const fs = require('fs');

//Variable for a date retrieving
const timeElapsed = Date.now();
const today = new Date(timeElapsed);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'gallery')
    },
    filename: function (req, file, cb) {
        //Infront file.originalname: today.toDateString() + '-' +
        cb(null, file.originalname)
    }
});

const Upload = multer({storage: storage}).array('file');

//Get Array of Images from the directory folder
function getImagesFromDirectory(dirPath){
    let allImages = [];
    let files = fs.readdirSync(dirPath);

    for (const file of files) {
        allImages.push(file);
    }
    return allImages;
}

exports.Upload = Upload;
exports.getImagesFromDirectory = getImagesFromDirectory;
