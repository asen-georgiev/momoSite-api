const express = require ("express");
const app = express();
const winston = require("winston");


require('./startup/db')();
require('./startup/cors')(app);
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/validation')();





const port = process.env.PORT || 3900;
const server = app.listen(port,()=>winston.info(`Listening for momo-api on port: ${port}`));

module.exports = server;
