# Currency-Conversion Server

Live app: 

Client GitHub: 

## API
_________
Unprotected-Endpoints
_____________________


`GET /convert` Returns the amount of a target currency that an amount of base currency would buy. Request body needs to be in the shape of: 

    {
        base_currency: [String],
        base_amount: [Number or String representation of a number],
        target_currency: [String]
    }

- Both base_currency and target_currency must be one of the following: USD, JPY, BGN, CZK, DKK, GBP, HUF, PLN, RON, SEK, CHF, ISK, NOK, HRK, RUB, TRY, AUD, BRL, CAD, CNY, HKD, IDR, ILS, INR, KRW, MXN, MYR, NZD, PHP, SGD, THB, ZAR
- They can be any combination of upper/lowercase letters

Returns data in the shape of:

    { 
        target_currency: [String],
        target_amount: [Number]
    }

- target_currency will be the same as the previous example but will be returned as all uppercase letters.


___________
Errors


- `All Errors` will return with an error status and an object with a message key. The error message is written there. 

______



## Summary

This server allows users to convert between different currencies. This is based off the live exchange rates at https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml

## Technology Used

Javascript, Express, Mocha, Chai
