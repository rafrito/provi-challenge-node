require('dotenv/config');
const { Pool } = require('pg')

pool = new Pool();
module.exports = pool;
