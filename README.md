# Provi challenge

This repository is a solution to the challenge proposed in https://github.com/provicapital/challenge_node

### Dependencies

This project uses **Postogresql 12**, **node 14** and **npm 6**. You should have these set up before digging in the application.

## Get started

Create an empty Postgresql database and write the connection credentials to the file **.env**. After that you should run `npm install` to install dependencies, then `npm run init` to create the underline database structure.

The database has two tables: **users** - which persists user information - and **loan_request_flux** - that has sequence of endpoints that the user should access in order. When you `run init`, a default flux is created. You can also write a new **flux** column. The last such column will serve as a default flux for new users.

Now you can run `npm start` to begin our application. Make a visit to **GET /** to start the loan request process. More precisely you should:

- Sign Up
    by registering an email account and password. You will receive an verification email.
- Login and POST your information to the sequence of endpoints.

All requests are **application/json** contents and instructions about what to do next are sent in te response to your request, so *pay attention to them!**. After signing in, you will generally post an authentication token (which will expire in 2 hours) together with some data specified by the last request... more or less like 

`
{
    "token":"someweirdtoken918734bkjg2mv1234v",
    "data": {
        "name":"Rafael Mateus Marques"
    }
}
`

By the end of this process you would have asked for a loan to pay for your studies/course/professional improvement.

### Any doubts?...

... email me and I'll try to help. My email is r.mateusmarques@gmail.com.

Thank You!