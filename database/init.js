// This script starts the database structure for this project.
// It should be run at the start of the application.
require('dotenv').config();
const pool = require('../database');

pool.query(
  `
  create table loan_request_flux (
    id serial primary key, 
    flux varchar (50) [], 
    creation_date timestamp default current_timestamp
  );
  create table users (
    id serial primary key, 
    email varchar (255) not null, 
    pass varchar (50) not null, 
    phone varchar (20),
    cpf varchar (11), 
    address json,
    first_name varchar (50), 
    last_name varchar (255), 
    birth_date date, 
    updated_on timestamp,
    amount_requested money,
    flux_id integer not null references loan_request_flux(id),
    current_endpoint varchar (50),
    next_endpoint varchar (50)
  );
  insert into loan_request_flux (flux)
  values (array ['/loan/name', '/loan/cpf', '/loan/birth-date', '/loan/phone', '/loan/address', '/loan/amount-requested']);
  `
)
  .then(() => {
    console.log('Database structure initialized...')
    pool.end();
  })
  .catch(err => { console.error('Error while initializing databse\n', err) });