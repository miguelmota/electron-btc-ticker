var request = require('request');
var _ = require('lodash');

var Api = {
  getBTCTicker: function() {
    var tickerEndpoint = 'https://api.coinmarketcap.com/v1/ticker/bitcoin';

    return new Promise((resolve, reject) => {
      request({
        url: tickerEndpoint,
        json: true
      }, (error, response, body) => {
        if (error || !body) {
          return reject(error);
        }

        var data = _.mapKeys(
          _.get(body, [0], {}), (v, k) => _.camelCase(k)
        );

        resolve(data);
      });
    });
  },
  getETHTicker: function() {
    var tickerEndpoint = 'https://api.coinmarketcap.com/v1/ticker/ethereum';

    return new Promise((resolve, reject) => {
      request({
        url: tickerEndpoint,
        json: true
      }, (error, response, body) => {
        if (error || !body) {
          return reject(error);
        }

        var data = _.mapKeys(
          _.get(body, [0], {}), (v, k) => _.camelCase(k)
        );

        resolve(data);
      });
    });
  }
};

module.exports = Api;
