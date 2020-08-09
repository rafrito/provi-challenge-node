const jwt = require('jsonwebtoken');

const auth = {};
const privateKey = 'provi-challenge'

auth.genLoginToken = (email, password) => {
    return jwt.sign(
        { email, password }
        , privateKey,
        { expiresIn: 60 * 60 * 2 });
};

auth.genEmailToken = (email, password) => {
    return jwt.sign({ email, password }, privateKey)
};

auth.checkLoginToken = (token) => {
    return jwt.verify(token, privateKey)
};

auth.checkEmailToken = (token) => {
    return jwt.verify(token, privateKey)
};

module.exports = auth;