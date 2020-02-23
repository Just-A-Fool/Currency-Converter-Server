require('dotenv').config();
const app = require('../src/app');

describe('/convert route', () => {

    describe('POST /convert Route', () => {

        //Missing info in body
        it('returns 400 if not supplied with base_currency', () => {
            return supertest(app)
                .post('/convert')
                .send({ base_amount: 123, target_currency: 'cad' })
                .expect(400, { message: 'Must supply base_currency in request body' });
        });

        it('returns 400 if not supplied with base_amount', () => {
            return supertest(app)
                .post('/convert')
                .send({ base_currency: 'usd', target_currency: 'cad' })
                .expect(400, { message: 'Must supply base_amount in request body' });
        });

        it('returns 400 if not supplied with target_currency', () => {
            return supertest(app)
                .post('/convert')
                .send({ base_amount: 123, base_currency: 'usd' })
                .expect(400, { message: 'Must supply target_currency in request body' });
        });

        //Invalid info provided in body
        it('returns 400 if invalid base_currency is provided', () => {
            return supertest(app)
                .post('/convert')
                .send({ base_amount: 123, base_currency: 'asdf', target_currency: 'cad' })
                .expect(400, { 'message': 'base_currency must be one of the following: USD, JPY, BGN, CZK, DKK, GBP, HUF, PLN, RON, SEK, CHF, ISK, NOK, HRK, RUB, TRY, AUD, BRL, CAD, CNY, HKD, IDR, ILS, INR, KRW, MXN, MYR, NZD, PHP, SGD, THB, ZAR' });
        });

        it('returns 400 if invalid target_currency is provided', () => {
            return supertest(app)
                .post('/convert')
                .send({ base_amount: 123, base_currency: 'usd', target_currency: 'asdf' })
                .expect(400, { 'message': 'target_currency must be one of the following: USD, JPY, BGN, CZK, DKK, GBP, HUF, PLN, RON, SEK, CHF, ISK, NOK, HRK, RUB, TRY, AUD, BRL, CAD, CNY, HKD, IDR, ILS, INR, KRW, MXN, MYR, NZD, PHP, SGD, THB, ZAR' });
        });

        it('returns 400 if base amount is not a number', () => {
            return supertest(app)
                .post('/convert')
                .send({ base_amount: 'asdf', base_currency: 'usd', target_currency: 'cad' })
                .expect(400, { message: 'base_amount must be a number' });
        });


        //Valid request
        it('returns 200 and info if valid request', () => {
            return supertest(app)
                .post('/convert')
                .send({ base_amount: '123', base_currency: 'usd', target_currency: 'cad' })
                .expect(200)
                .then(res => {
                    expect(res.body).to.be.an('Object');
                    expect(res.body).to.have.all.keys('target_amount', 'target_currency');
                    expect(res.body.target_currency).to.equal('CAD');
                });
        });
    });
});