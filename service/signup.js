const users = require('../database/users');
const auth = require('./auth');
const emailUtils = require('./email');
const dataFormat = require('../routes/endpointFormat');

const signup = {};

signup.createUser = async (token) => {
    const ans = {};
    try {
        const credentials = auth.checkEmailToken(token);
        await users.create(credentials.email, credentials.password);
        ans.body = {
            success: true,
            nextEndpoint: {
                name: '/login',
                expectedBody:{
                    email: 'your email here',
                    password: 'your password here'
                }
            }
        };
        ans.statusCode = 200;
    }
    catch (err) {
        ans.statusCode = 500,
            ans.body = {
                success: false,
                message: 'Failed creating new user.'
            }
    };

    return ans
};

signup.sendConfirmationMail = (email, password) => {
    const ans = {};
    if (!emailUtils.validate(email)) {
        ans.body = {
            success: false,
            message: 'Email must be a valid email. Try again'
        };
        ans.statusCode = 400;
        return ans
    };

    const token = auth.genEmailToken(email, password);
    try {
        emailUtils.sendMail(email, token)
        ans.body = {
            success: true,
            message: 'In instants you will receive a verification email.'
        }
    }
    catch (err) {
        console.log('#service\nError while creating new user\n', err);
        ans.statusCode = 500;
        ans.body = {
            success: false,
            message: `We couldn't send an email to your email account. Try again.`
        };
    };

    return ans
};

module.exports = signup;