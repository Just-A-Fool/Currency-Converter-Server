const express = require('express');
const CurrencyService = require('./CurrencyService');
const xss = require('xss');

const https = require('https');
const xml = require('xml2js');

const CurrencyRouter = express.Router();

CurrencyRouter.get('/convert', async (req, res, next) => {
    let { base_currency, base_amount, target_currency } = req.body;

    if (!base_currency)
        return res.status(400).json({ message: 'Must supply base_currency in request body' });
    if (!base_amount)
        return res.status(400).json({ message: 'Must supply base_amount in request body' });
    if (!target_currency)
        return res.status(400).json({ message: 'Must supply target_currency in request body' });

    let base_amount_float = parseFloat(base_amount);
    if (isNaN(base_amount_float))
        return res.status(400).json({ message: 'base_amount must be a number' })


    let currencyInfo = await CurrencyService.getCurrencyInfo();


    let base_currency_rate = currencyInfo.currencyObject[base_currency.toUpperCase()];
    let target_currency_rate = currencyInfo.currencyObject[target_currency.toUpperCase()];

    if (!base_currency_rate)
        return res.status(400).json({ message: `base_currency must be one of the following: ${currencyInfo.currencyTypes.join(', ')}` });
    if (!target_currency_rate)
        return res.status(400).json({ message: `target_currency must be one of the following: ${currencyInfo.currencyTypes.join(', ')}` });


    let target_amount = base_amount_float * (target_currency_rate / base_currency_rate);
    res.status(200).json({ target_currency: target_currency.toUpperCase(), target_amount: target_amount })

});

// CurrencyRouter.get('/convert/:id', (req, res, next) => {
//     let db = req.app.get('db');
//     let id = req.params.id;

//     //checks to see if id provided is a valid UUID
//     if (!id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
//         logger.error('Must provide valid UUID');
//         return res.status(400).json({ message: 'Must provide a valid ID to get' });
//     }

//     CurrencyService.getBookmarkById(db, id)
//         .then(resp => {
//         })
//         .catch(next);
// });

// CurrencyRouter.post('/convert', (req, res, next) => {
//     let db = req.app.get('db');
//     let post = {};

//     CurrencyService.postBookmark(db, post)
//         .then(resp => {
//         })
//         .catch(next);
// });

// CurrencyRouter.patch('/convert/:id', (req, res, next) => {
//     let db = req.app.get('db');
//     let id = 1;
//     let edit = {};

//     CurrencyService.patchBookmark(db, xss(id), edit)
//         .then(resp => {
//         })
//         .catch(next);
// });

// CurrencyRouter.delete('/convert/:id', (req, res, next) => {
//     let db = req.app.get('db');
//     let id = 1;

//     CurrencyService.deleteBookmark(db, xss(id))
//         .then(resp => {
//         })
//         .catch(next);
// });

module.exports = CurrencyRouter;