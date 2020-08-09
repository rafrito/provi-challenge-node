const pool = require('.');

const users = {};

// Creates a new row with email and password
users.create = async (email, password) => {
    const flux = await users.getFlux();
    const res = await pool.query(
        `
        insert into users (email, pass, flux_id, updated_on, next_endpoint)
        values ($1, $2, $3, current_timestamp, $4)
        returning id;
        `
        , [email, password, flux.id, flux.flux[0]]);

    return { nextEndpoint: flux.flux[0], userId: res.rows[0].id }
};

users.getFlux = async (fluxId) => {
    const sufix = fluxId ? `where id = ${fluxId}` : `order by id desc limit 1`
    const res = await pool.query(
        `
        select id, flux from loan_request_flux 
        `
        + sufix
    );

    return res.rows[0]
};

users.insertFlux = async (flux) => {
    await pool.query(
        `
        insert
        into
        loan_request_flux (flux)
    values ( $1 );
        `
        , [flux])
}

users.exists = async (email) => {
    const res = await pool.query(
        `
        select exists (select 1 from users where email = $1)
        `
        , [email]);

    return res.rows[0]
};

users.checkField = async (table, column, id) => {
    const res = await pool.query(
        `
        select ${column} from ${table} where id = $1
        `
        , [id]);

    return res.rows[0]
};

users.getCredentials = async (email) => {
    const res = await pool.query(
        `
        select pass from users
        where email = $1
        order by updated_on desc
        limit 1
        `
        , [email]);

    return res.rows[0]
};

users.getEndpoints = async (email) => {
    const res = await pool.query(
        `
        select
            lrf.flux as flux,
            u.current_endpoint as current,
            u.next_endpoint as next
        from
            users u
        left join loan_request_flux lrf on
            lrf.id = u.flux_id
        where
            u.email = $1
        order by
            updated_on desc
        limit 1
        `
        , [email]);

    return res.rows[0]
};

users.updateValue = async (column, value, email) => {
    const res = await pool.query(
        `
        update
            users
        set
            ${column} = $1,
            updated_on = current_timestamp
        where
            id in (
            select
                id
            from
                users
            where
                email = $2
            order by
                updated_on desc
            limit 1) returning id
        `
        , [value, email]);

    return res
};

users.repeatRecord = async (email) => {
    const res = await pool.query(
        `
        insert
            into
            users (email, pass, cpf, address , first_name , last_name , birth_date , updated_on , flux_id, current_endpoint , next_endpoint )
        select
            email,
            pass,
            cpf,
            address ,
            first_name ,
            last_name ,
            birth_date ,
            current_timestamp ,
            flux_id,
            current_endpoint ,
            next_endpoint
        from
            users
        where
            id in (
            select
                id
            from
                users
            where
                email = $1
            order by
                updated_on desc
            limit 1) returning id
        `
        , [email]);

    return res
};

users.getInfo = async (email) => {
    const res = await pool.query(
        `
        select * from users
        where email = $1
        order by updated_on desc
        limit 1
        `
        , [email]);

    return res.rows[0]
}

module.exports = users;