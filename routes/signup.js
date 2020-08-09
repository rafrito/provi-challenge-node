const { Router } = require('express');
const signup = require('../service/signup');

const router = new Router();

router.post('/', (req, res) => {
    if (!(req.body.email && req.body.password)) {
        res.statusCode = 400,
            res.json({
                successs: false,
                message: 'You must send body.email and body.password in the request.'
            })
    };

    try {
        const ans = signup.sendConfirmationMail(req.body.email, req.body.password);
        res.json(ans.body);
        res.statusCode = ans.statusCode;
    }
    catch (err) {
        console.error('#signup\n');
        throw err
    }
});

router.post('/verify', (req, res) => {
    if (!req.body.token) {
        res.statusCode = 400,
            re.json({
                success: false,
                message: 'You must send body.token in the request.'
            });
    };

    signup.createUser(req.body.token)
        .then(ans => {
            res.json(ans.body);
            res.statusCode = ans.statusCode;
        })
        .catch(err => {
            console.error('#signup #verify\n');
            throw err
        });
});

module.exports = router;