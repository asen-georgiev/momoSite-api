const express = require("express");
const admins = require('../routes/admins');
const users = require('../routes/users');
const comments = require('../routes/comments');


module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use('/api/admins',admins);
    app.use('/api/users',users);
    app.use('/api/comments',comments);
}
