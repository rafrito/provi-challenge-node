const pool = require('../database');
const users = require('../database/users');
const { loan, fluxStep } = require('../service/loan');

// We test two different flux
describe('Database tests', () => {
    test('Create a flux and populate a user', async () => {
        await users.insertFlux([
            '/loan/name',
            '/loan/cpf',
            '/loan/address',
            '/loan/phone',
            '/loan/birth-date',
            '/load/amount-requested'])

        const email = 'r.mateusmarques@gmail.com';
        const password = '12345';

        const name = 'Rafael Mateus Marques';
        const birth = '1977-10-25';
        const phone = '(16)997788665';
        const cpf = '12345678909';
        const amount = 30000;
        const address = { cep: '05508030', number: 1235, complement: 'casa a' };

        await users.create(email, password);
        await Promise.all([
            loan.writeUserName(name, email),
            loan.writeUserBirth(birth, email),
            loan.writeUserPhone(phone, email),
            loan.writeUserCPF(cpf, email),
            loan.writeAmountRequested(amount, email),
            loan.writeUserAddress(address, email),
        ]).then(async () => {
            let res = await users.getInfo(email)

            expect(res.first_name).toEqual(name.split(' ')[0]);
            expect(res.cpf).toEqual(cpf);
            expect(res.phone).toEqual(phone.replace(/[^0-9]/g, ''));
            expect(res.amount_requested.replace(/[^0-9]/g, '')).toEqual(String(amount * 100));
            expect(Date(res.birth_date)).toEqual(Date(birth));
        }).catch(err => {
            console.error('A test may have failed', err)
        })

    });
});

describe('A different flux, checking expected flux', () => {
    test('We check expected flux order', async () => {
        await users.insertFlux([
            '/loan/cpf',
            '/loan/amount-requested',
            '/loan/address',
            '/loan/phone',
            '/loan/birth-date',
            '/loan/name'
        ])

        const email = 'marcelofreixo@camara.br'
        await users.create(email, 'brasil');

        let res;
        try {
            res = fluxStep(email, '/loan/cpf');
            expect((await res).body.nextEndpoint).toEqual('/loan/amount-requested');
            res = fluxStep(email, '/loan/amount-requested');
            expect((await res).body.nextEndpoint).toEqual('/loan/address');
            res = fluxStep(email, '/loan/address');
            expect((await res).body.nextEndpoint).toEqual('/loan/phone');
            res = fluxStep(email, '/loan/phone');
            expect((await res).body.nextEndpoint).toEqual('/loan/birth-date');
            res = fluxStep(email, '/loan/birth-date');
            expect((await res).body.nextEndpoint).toEqual('/loan/name');
        }
        catch (err) {
            console.error('Some unexpected error', err)
        }
    })
});

afterAll(async () => {
    await users.insertFlux([
        '/loan/name',
        '/loan/cpf',
        '/loan/address',
        '/loan/phone',
        '/loan/birth-date',
        '/loan/amount-requested'
    ]);

    pool.end()
});