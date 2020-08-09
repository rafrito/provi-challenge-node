const template = {};
template.rawText =
`Welcome to Provi-Challenge!

Complete your registration by POSTing the following body to /signup/verify.

{"token": "$"}

We hope to be part of your growing process!
`

template.getMessage = (arr, text) => {
    return arr.reduce((acc, substitute) => acc.replace('$', substitute), text)
};

module.exports = template;