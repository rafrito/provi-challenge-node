const signup = require('./signup');
const loan = require('./loan');
const login = require('./login');
const { Router } = require('express');

const root = new Router();

root.get('/', (req, res) => {
    res.statusCode = 200;
    res.json({
        message: 'Hello from Provi-Challenge! To sign up you must POST to /signup a valid email and a password.'
    });
});

const errorHandler = (err, req, res, next) => {
    console.error('Unindentified server error\n', err);
    res.statusCode = 500;
    res.json({
        success: false,
        message: 'Unindentified server error'
    });
};

module.exports = {
    root,
    signup,
    login,
    loan,
    errorHandler
};