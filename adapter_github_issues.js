var request = require('request');

// All github search APIs have a rate limit of 5 requests per minute for
// unauthicated requests. Providing basic auth or OAuth credentials would
// definitely help, raising the rate limit to 20 requests per minute.

module.exports = function (query, callback) {

    // TODO Restrict issue search to user innoQ

    // More optional query parameters
    // page:
    // per_page:
    // sort:
    // order:

    var options = {
        url: 'https://api.github.com/search/issues?q=' + query,
        headers: {
            'User-Agent': 'search-aggregator',
        },
        json: true,
    };
	  request.get(options, function (error, response, body) {
	      if (error) {
            console.log('error: ');
            console.log(error);
	          return callback(error);
	      } else if (response.statusCode != 200) {
            console.log('error: ');
            console.log(error);
	          return callback(new Error('Unexpected HTTP status: ' + response.status));
        }
        var results = [];
        if (body && body.items) {
            body.items.forEach(function(element) {
                results.push({
                    url: element.url,
                    title: element.title,
                    timestamp: element.updated_at,
                });
            });
        }
        return callback(null, results);
    });
};
