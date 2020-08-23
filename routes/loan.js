const { Router } = require("express");
const auth = require("../service/auth");
const { loan } = require("../service/loan");
const { dataFormat, compareKeys } = require("./endpointFormat");

const router = new Router();

// body integrity middleware
router.use(async (req, res, next) => {
    if (!req.body.token || !req.body.data) {
        res.statusCode = 400;
        res.json({
            success: false,
            message: 'You must pass token and data in the body request.'
        });
        return res.end()
    }

    if (!compareKeys(req.body.data, req.originalUrl)) {
        res.statusCode = 400,
            res.json({
                success: false,
                message: 'You must pass body.data as specified.',
                expectedBody: dataFormat(req.originalUrl)
            });
        return res.end()
    }

    try {
        const decoded = auth.checkLoginToken(req.body.token);
        req.user = { email: decoded.email };

        await loan.isValidEndpoint(req.originalUrl, req.user.email)
            .then(end => {
                if (!end.valid) {
                    res.statusCode = 400;
                    res.json({
                        success: false,
                        message: 'The order of the endpoints is imperative. You can repost to the last endpoint or go to the next only.',
                        nextEndpoint: end.nextEndpoint,
                        expectedBody: dataFormat(end.nextEndpoint)
                    });
                    return res.end()
                }
            })
        next()
    }
    catch (err) {
        res.json({
            success: false,
            message: 'Invalid auth token. It may have expired. Login to get a valid auth token.'
        });
        res.statusCode = 401;
        return res.end()
    }
});

router.post('/birth-date', (req, res, next) => {
    loan.writeUserBirth(req.body.data['birth-date'], req.user.email)
        .then(ans => {
            res.statusCode = ans.statusCode;
            res.json(ans.body);
        })
        .catch(err => {
            console.error('#loan #birth-date\n');
            next(err)
        });
});

router.post('/name', (req, res, next) => {
    loan.writeUserName(req.body.data.name, req.user.email)
        .then(ans => {
            res.statusCode = ans.statusCode;
            res.json(ans.body);
        })
        .catch(err => {
            console.error('#loan #name\n');
            next(err)
        });
});

router.post('/cpf', (req, res, next) => {
    loan.writeUserCPF(req.body.data.cpf, req.user.email)
        .then(ans => {
            res.statusCode = ans.statusCode;
            res.json(ans.body);
        })
        .catch(err => {
            console.error('#loan #cpf\n');
            next(err)
        });
});

router.post('/phone', (req, res, next) => {
    loan.writeUserPhone(req.body.data.phone, req.user.email)
        .then(ans => {
            res.statusCode = ans.statusCode;
            res.json(ans.body);
        })
        .catch(err => {
            console.error('#loan #phone\n');
            next(err)
        });
});

router.post('/address', (req, res, next) => {
    loan.writeUserAddress(req.body.data, req.user.email)
        .then(ans => {
            res.statusCode = ans.statusCode;
            res.json(ans.body);
        })
        .catch(err => {
            console.error('#loan #address\n');
            next(err)
        });
});

router.post('/amount-requested', (req, res, next) => {
    loan.writeAmountRequested(req.body.data['amount-requested'], req.user.email)
        .then(ans => {
            res.statusCode = ans.statusCode;
            res.json(ans.body);
        })
        .catch(err => {
            console.error('#loan #amount-requested\n');
            next(err)
        });
});

module.exports = router;