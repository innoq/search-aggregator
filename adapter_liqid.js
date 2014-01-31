var request = require('request');

module.exports = function (query, settings, callback) {
    var results = [];
    console.log('adapter LiQID: starting for query ' + query);
    callback(null, results);
}