const express = require('express');
const CurrencyService = require('./CurrencyService');

const CurrencyRouter = express.Router();

CurrencyRouter.post('/convert', async (req, res, next) => {
    try {
        let { base_currency, base_amount, target_currency } = req.body;

        //Some error handling checks for valid request body.
        if (!base_currency)
            return res.status(400).json({ message: 'Must supply base_currency in request body' });
        if (!base_amount)
            return res.status(400).json({ message: 'Must supply base_amount in request body' });
        if (!target_currency)
            return res.status(400).json({ message: 'Must supply target_currency in request body' });

        let base_amount_float = parseFloat(base_amount);
        if (isNaN(base_amount_float))
            return res.status(400).json({ message: 'base_amount must be a number' })

        //Returns an object with key/value pairs for currency type and exchange rate.
        let currencyInfo = await CurrencyService.getCurrencyInfo();

        //I'm using an object since they are constant time to access the given key
        let base_currency_rate = currencyInfo[base_currency.toUpperCase()];
        let target_currency_rate = currencyInfo[target_currency.toUpperCase()];

        //I considered just using a "join" on an array instead of this string, and on this scale it doesn't make much of a difference but join is slower. 
        let validCurrencyTypes = "USD, JPY, BGN, CZK, DKK, GBP, HUF, PLN, RON, SEK, CHF, ISK, NOK, HRK, RUB, TRY, AUD, BRL, CAD, CNY, HKD, IDR, ILS, INR, KRW, MXN, MYR, NZD, PHP, SGD, THB, ZAR";

        /* By using an object and checking if that value has been stored I get around having to iterate through the array of currency types. 
        As mentioned above at this scale it isn't a huge issue but it would be faster this way on a large scale and I wanted to show some of my knowledge.
        In a real world application of this, since there are a very limited number of different currencies and looping through them costs next to nothing,
        I would put these two checks above the getCurrencyInfo() call on line 23 to prevent the need for an API call. Checking instead if the base/target currency
        is not in an array of all currencies types.*/
        if (!base_currency_rate)
            return res.status(400).json({ message: `base_currency must be one of the following: ${validCurrencyTypes}` });
        if (!target_currency_rate)
            return res.status(400).json({ message: `target_currency must be one of the following: ${validCurrencyTypes}` });

        //Actual conversion math here.
        let target_amount = base_amount_float * (target_currency_rate / base_currency_rate);
        res.status(200).json({ target_currency: target_currency.toUpperCase(), target_amount: target_amount })

    } catch (e) {
        //Sends uncaught error to my error handling middleware
        next(e);
    }
});

module.exports = CurrencyRouter;