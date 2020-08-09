const { Router } = require("express");
const router = new Router();
const login = require('../service/login');

router.post('/', (req, res) => {
    if (!(req.body.email && req.body.password)) {
        res.statusCode = 400,
            res.json({
                success: false,
                message: 'Please send email and password in the body request.'
            });

        return
    };

    login.authenticate(req.body.email, req.body.password)
    .then(ans =>{
        res.statusCode = ans.statusCode;
        res.json(ans.body);
    })
    .catch(err => {
        console.error('#route #login\n');
        throw err
    })

});

module.exports = router;