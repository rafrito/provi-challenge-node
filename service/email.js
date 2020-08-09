const apiKey = '433d3a0f32a7d5dceb6a043da0a65a3e-f7d0b107-75d38683';
const domain = 'sandbox182d33282ee142c1bef7bff1388b81b2.mailgun.org';

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