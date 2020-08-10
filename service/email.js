require('dotenv/config');
const apiKey = process.env.MAILAPIKEY;
const domain = process.env.MAILDOMAIN;

const validator = require('email-validator');
const mailgun = require('mailgun-js')({ domain, apiKey });
const template = require('./template');

const emailUtils = {};

emailUtils.validate = (email) => validator.validate(email);

emailUtils.sendMail = (userEmail, token) => {
    mailgun.messages().send({
            from: `provi-challenge@${domain}`,
            to: userEmail,
            subject: 'Welcome to Provi-Challenge',
            text: template.getMessage([token], template.rawText)
        })
        .then(body => console.log(`Email successfully sent to ${userEmail}\n`, body))
        .catch(err =>{
            console.error(`#email\nFailed sending email to ${userEmail}\n`, err);
            throw err
        })
};

module.exports = emailUtils;