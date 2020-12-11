const express = require("express");
const admins = require('../routes/admins');
const users = require('../routes/users');
const comments = require('../routes/comments');
const images = require('../routes/images');


module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(express.static('gallery'));
    app.use('/api/admins',admins);
    app.use('/api/users',users);
    app.use('/api/comments',comments);
    app.use('/api/images',images);
}
