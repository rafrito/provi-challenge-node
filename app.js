require('dotenv/config');
const express = require('express');
const routes = require('./routes');

const app = express();
app.use(express.json());
app.use('/signup', routes.signup);
app.use('/login', routes.login);
app.use('/loan', routes.loan)
app.use('/', routes.root);
app.use(routes.errorHandler)

app.listen(process.env.PORT, () => {
    console.log(`Server listening at port ${process.env.PORT}`)
});