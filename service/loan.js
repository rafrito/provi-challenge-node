const users = require('../database/users');
const { dataFormat } = require('../routes/endpointFormat');
const rp = require('request-promise');

const cepUrlFormat = 'https://viacep.com.br/ws/$/json/';
const loan = {};

loan.writeUserName = async (fullName, email) => {
    fullName = String(fullName);
    const nameSplit = fullName.split(' ');
    firstName = nameSplit[0]
    lastName = nameSplit.slice(1).join(' ')

    compareAndUpdate(email, 'first_name', firstName)
        .then(async () => await compareAndUpdate(email, 'last_name', lastName))
        .catch(err => { throw err })

    return fluxStep(email, '/loan/name')
};

loan.writeUserBirth = async (birthDate, email) => {
    birthDate = String(birthDate);
    try {
        await compareAndUpdate(email, 'birth_date', birthDate)
    }
    catch (err) {
        return {
            statusCode: 400,
            body: {
                success: false,
                message: 'The date format must be YYYY-MM-DD'
            }
        }
    }

    return fluxStep(email, '/loan/birth-date');
};

loan.writeUserCPF = async (cpf, email) => {
    cpf = String(cpf);
    if (!validateCPF(cpf)) {
        return {
            statusCode: 400,
            body: {
                success: false,
                message: 'Invalid CPF. Try again.'
            }
        }
    };
    cpf = parseInt(cpf.replace(/[^0-9]/g, ''));
    await compareAndUpdate(email, 'cpf', cpf);
    return fluxStep(email, '/loan/cpf')
};

loan.writeUserAddress = async (data, email) => {
    data.cep = String(data.cep);
    const cep = String(data.cep).replace(/[^0-9]/g, '');
    const options = {
        uri: cepUrlFormat.replace('$', cep),
        json: true
    };
    const res = await rp(options);
    const address = res;
    address.complemento = data.complement;
    address.numero = data.number

    await compareAndUpdate(email, 'address', address)
    return fluxStep(email, '/loan/address')
};

loan.writeUserPhone = async (phone, email) => {
    phone = String(phone).replace(/[^0-9]/g, '');
    await compareAndUpdate(email, 'phone', phone);
    return fluxStep(email, '/loan/phone')
};

loan.writeAmountRequested = async (amountRequested, email) => {
    amountRequested = String(amountRequested).replace(/[^0-9]/g, '');
    await compareAndUpdate(email, 'amount_requested', amountRequested)
    return fluxStep(email, '/loan/amount-requested')
};

const compareAndUpdate = async (email, column, value) => {
    const info = await users.getInfo(email);
    if ((String(info[column]) !== String(value)) && (info[column] !== null)) {
        await users.repeatRecord(email);
    };

    await users.updateValue(column, value, email);
};

const fluxStep = async (email, step) => {
    const endpoints = await users.getEndpoints(email);
    let nextEndpoint = endpoints.next;

    if (step == nextEndpoint) {
        const indexNext = endpoints.flux.indexOf(endpoints.next);
        const newCurrent = endpoints.next;
        const newNext = endpoints.flux[indexNext + 1]

        const res = await Promise.all([
            users.updateValue('current_endpoint', newCurrent, email),
            users.updateValue('next_endpoint', newNext, email)
        ]);

        const ans = {};
        if (!newNext) {
            return {
                statusCode: 200,
                body: {
                    success: true,
                    message: `You have finished your loan request. We will analize the request and contact you soon. Thank you!`
                }
            }
        }
        nextEndpoint = newNext;
    }

    return {
        statusCode: 200,
        body: {
            success: true,
            nextEndpoint: nextEndpoint,
            expectedBody: dataFormat(nextEndpoint)
        }
    };
};

loan.isValidEndpoint = async (endpoint, email) => {
    const endpoints = await users.getEndpoints(email)
    if ((endpoint == endpoints.next) || (endpoint == endpoints.current)) {
        return { valid: true, nextEndpoint: endpoints.next }
    }
    return { valid: false, nextEndpoint: endpoints.next }
};

const validateCPF = (cpfString) => {
    const cpf = cpfString.replace(/[^0-9]/g, '');
    const cpfArr = Array.from(cpf, v => parseInt(v));
    let isCPF = true;
    if (cpf.length !== 11) { return false };
    if (cpfArr.every(i => i == cpfArr[0])) { return false }
    [9, 10].forEach((j) => {
        let remainder = (cpfArr.slice(0, j).reduce((acc, cur, k) => {
            return acc + cur * (j + 1 - k)
        }, 0) * 10) % 11;

        remainder = remainder == 10 ? 0 : remainder;
        if (remainder !== cpfArr[j]) { isCPF = false }
    });
    return isCPF
};

module.exports = { fluxStep, loan };