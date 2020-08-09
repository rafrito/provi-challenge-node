const examples = {
    '/loan/cpf': { cpf: '12345678900' },
    '/loan/birth-date': { 'birth-date': '1995-07-30' },
    '/loan/name': { name: 'Joao das Neves' },
    '/loan/phone': { phone: '(00) 98765-4321' },
    '/loan/amount-requested': { 'amount-requested': '3000.00' },
    '/loan/address': {
        cep: '05509-030',
        number: '12345',
        complement: 'bloco b, apto 211'
    }
};

const dataFormat = (nextEndpoint) => {
    const next = { token: 'your token here' };
    next.data = examples[nextEndpoint];

    return next
};

const compareKeys = (obj, endpointName) => {
    const keys1 = Object.keys(obj).sort();
    const keys2 = Object.keys(examples[endpointName]).sort();

    return JSON.stringify(keys1) === JSON.stringify(keys2)
}

module.exports = { dataFormat, compareKeys };

