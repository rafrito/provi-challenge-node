const users = require('../database/users');
const auth = require('./auth');
const { dataFormat } = require('../routes/endpointFormat');

const login = {};

login.authenticate = async (email, password) => {
    let ans = {};
    try {
        const credentials = await users.getCredentials(email);
        const endpoints = await users.getEndpoints(email);
        if (credentials && (password == credentials.pass)) {
            ans.body = {
                success: true,
                token: auth.genLoginToken(email, password),
                message: 'This is your token and you should pass it on every step of loan request. It will expire in 2 hours.',
                nextEndpoint: endpoints.next,
                expectedBody: dataFormat(endpoints.next)
            }
            ans.statusCode = 200;
            return ans
        };

        ans.body = {
            success: false,
            message: 'Invalid email or password.'
        };
        ans.statusCode = 401;

        return ans
    }
    catch (err) {
        console.error('#login #authenticate\n Undetected error\n', err);
    }
};

module.exports = login;