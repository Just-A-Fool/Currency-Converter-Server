const https = require('https');
const xml = require('xml2js');

const BOILERPLATEService = {
    async getCurrencyInfo() {

        let xmlParsedArray = await new Promise((resolve, reject) => {
            https.get('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml', res => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {

                    xml.parseString(data, { explicitArray: false }, (err, result) => {

                        //Returns an Array containing only the nessessary information.
                        resolve(result['gesmes:Envelope'].Cube.Cube.Cube);
                    });
                })
            })
        })

        let currencyObject = {};
        let currencyTypes = [];

        xmlParsedArray.forEach(currency => {
            let currencyName = currency.$.currency;
            let currencyRate = currency.$.rate;

            currencyObject[currencyName] = currencyRate;
            currencyTypes.push(currencyName);
        });

        return { currencyObject, currencyTypes }
    }
};

module.exports = BOILERPLATEService;