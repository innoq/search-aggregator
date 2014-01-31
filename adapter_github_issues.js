var request = require('request');

// All github search APIs have a rate limit of 5 requests per minute for
// unauthicated requests. Providing basic auth or OAuth credentials would
// definitely help, raising the rate limit to 20 requests per minute.

module.exports = function (query, settings, callback) {
    console.log('adapter github issue search: starting for query ' + query);

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
	          console.log('Unexpected HTTP status: ' + response.status);
	          return callback(new Error('Unexpected HTTP status: ' + response.status));
        }
        var results = [];
        console.log('adapter github issue search: processing results for query ' + query);
        if (body && body.items) {
            body.items.forEach(function(element) {
                results.push({
                    url: element.html_url,
                    title: element.title,
                    timestamp: element.updated_at,
                });
            });
        }
        return callback(null, results);
    });
};
