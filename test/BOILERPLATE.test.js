require('dotenv').config();
const app = require('../src/app');

describe('/convert route', () => {



    describe('GET /convert Route', () => {
        it('returns 400 if not supplied with base_currency', () => {
            return supertest(app)
                .get('/convert')
                .send({ base_amount: 123, target_currency: 'cad' })
                .expect(400, { message: 'Must supply base_currency in request body' });
        });

        it('returns 400 if not supplied with base_amount', () => {
            return supertest(app)
                .get('/convert')
                .send({ base_currency: 'usd', target_currency: 'cad' })
                .expect(400, { message: 'Must supply base_amount in request body' });
        });

        it('returns 400 if not supplied with target_currency', () => {
            return supertest(app)
                .get('/convert')
                .send({ base_amount: 123, base_currency: 'usd' })
                .expect(400, { message: 'Must supply target_currency in request body' });
        });

        it('returns 400 if incorrect base_currency is provided', () => {
            return supertest(app)
                .get('/convert')
                .send({ base_amount: 123, base_currency: 'asdf', target_currency: 'cad' })
                .expect(400, { 'message': 'base_currency must be one of the following: USD, JPY, BGN, CZK, DKK, GBP, HUF, PLN, RON, SEK, CHF, ISK, NOK, HRK, RUB, TRY, AUD, BRL, CAD, CNY, HKD, IDR, ILS, INR, KRW, MXN, MYR, NZD, PHP, SGD, THB, ZAR' });
        });

        it('returns 400 if incorrect target_currency is provided', () => {
            return supertest(app)
                .get('/convert')
                .send({ base_amount: 123, base_currency: 'usd', target_currency: 'asdf' })
                .expect(400, { 'message': 'target_currency must be one of the following: USD, JPY, BGN, CZK, DKK, GBP, HUF, PLN, RON, SEK, CHF, ISK, NOK, HRK, RUB, TRY, AUD, BRL, CAD, CNY, HKD, IDR, ILS, INR, KRW, MXN, MYR, NZD, PHP, SGD, THB, ZAR' });
        });

        it('returns 400 if base amount is not a number', () => {
            return supertest(app)
                .get('/convert')
                .send({ base_amount: 'asdf', base_currency: 'usd', target_currency: 'cad' })
                .expect(400, { message: 'base_amount must be a number' });
        });

        it('returns 200 and info if valid request', () => {
            return supertest(app)
                .get('/convert')
                .send({ base_amount: '123', base_currency: 'usd', target_currency: 'cad' })
                .expect(200)
                .then(res => {
                    expect(res.body).to.be.an('Object');
                    expect(res.body).to.have.all.keys('target_amount', 'target_currency');
                    expect(res.body.target_currency).to.equal('CAD');
                });
        });

        // context('BOILERPLATE-table has data', () => {
        //     beforeEach(() => {
        //         return db.into('BOILERPLATE-table')
        //             .insert(testData);
        //     });

        //     it('returns 200 and array of objects with proper keys when requested', () => {
        //         return supertest(app)
        //             .get('/BOILERPLATE-table')
        //             .set('Authorization', `Bearer ${API_TOKEN}`)
        //             .expect('Content-Type', /json/)
        //             .expect(200)
        //             .then(res => {
        //                 expect(res.body).to.be.an('Array').with.lengthOf(???);
        //                 expect(res.body[0]).to.be.an('Object');
        //                 expect(res.body[0]).to.have.all.keys('???', '???');
        //             });
        //     });
        // });
    });
});