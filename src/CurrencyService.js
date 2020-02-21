const https = require('https');
const xml = require('xml2js');

const CurrencyService = {
    async getCurrencyInfo() {

        let xmlParsedArray = await new Promise((resolve, reject) => {
            //Using https to get around having to use a third party library
            https.get('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml', res => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    //I'm not used to using xml and this seemed to be the best tool for the job. 
                    xml.parseString(data, { explicitArray: false }, (err, result) => {

                        //Returns an Array to the pending promise containing only the nessessary information.
                        resolve(result['gesmes:Envelope'].Cube.Cube.Cube);
                    });
                })
            })
        })

        let currencyObject = {};

        xmlParsedArray.forEach(currency => {
            //The $ is the default way to access each xml element's attributes through xml2js
            let currencyName = currency.$.currency;
            let currencyRate = currency.$.rate;

            //setting key/value pair for the object based on currency type and exchange rate
            currencyObject[currencyName] = currencyRate;
        });

        return currencyObject
    }
};

module.exports = CurrencyService;