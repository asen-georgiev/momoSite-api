const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");


module.exports = function () {
    const options = {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        serverSelectionTimeoutMS: 5000,
        useFindAndModify: false
    }
    mongoose.set('useCreateIndex',true);
    const db = config.get('db');
    mongoose.connect(db,options)
        .then(() => winston.info(`Connected to ${db}...`));
    
}
