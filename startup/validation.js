const Joi = require("joi");

//Функция, която помага за стринга на Joi objectId
module.exports = function(){
    Joi.objectId = require('joi-objectid')(Joi);
}
