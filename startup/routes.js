const express = require("express");
const admins = require('../routes/admins');


module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use('/api/admins',admins);
}
