const express = require('express');
const router = express.Router();
const sendGrid = require("@sendgrid/mail");
const {Email,validateEmail} = require('../models/email');
const _ = require('lodash');
const authorization = require("../middleware/authorization");
const administration = require("../middleware/administration");

const apiKey = process.env.SENDGRID_API_KEY;

//Creating single Email object, sending email through SendGrid - no token needed.
router.post('/', async(req, res) => {
    const {error} = validateEmail(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let email = new Email(_.pick(req.body,['fullname','email','subject','message']));
    await email.save();

    sendGrid.setApiKey(apiKey);
    const msg = {
        to: req.body.email,
        from: "empyrean1981@abv.bg",
        subject: req.body.subject,
        text: "Thank you, for your e-mail, we will contact you soon!",
        html:`<h3>Hello ${req.body.fullname}!</h3>
               <p>Thank you, for your email, 
               we will contact you soon.</p>`
    };
     sendGrid
        .send(msg)
        .then(() => {
            console.log('Email sent successfully!');
            res.status(200).send(email);
        })
        .catch((error) => {
           res.status(401).send('There was an error sending the email through API.');
           console.log(error);
        });
});


//Retrieving all the Email objects from DB - admin rights only.
router.get('/',[authorization,administration],async(req, res) => {
    const emails = await Email.find().sort('-_id');
    res.send(emails);
});


//Deleting single Email object from DB - admin rights only.
router.delete('/:id',[authorization,administration], async(req, res) => {
    const email = await Email.findByIdAndDelete(req.params.id);
    let reqId = req.params.id;
    if(!email) return res.status(404).send(`Email with ID: ${reqId} was not found!`);
    res.send(email);
});


module.exports = router;
