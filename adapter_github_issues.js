var request = require('request');

module.exports = function (query, settings, callback) {

    if (!settings) {
        console.log('Github Issue Search: No settings provided. Search will ' +
        'not be restricted to user or organization, restrictive rate ' +
        'limits are in place. (5 requests/minute)');
    }
    if (!settings.searchRestrictedToUser) {
        console.log('Github Issue Search: Missing settings property: ' +
        'searchRestrictedToUser. Search will not be restricted to user or ' +
        'organization.');
    }
    if (!settings.username || !settings.password) {
        console.log('Github Issue Search: Missing settings properties: ' +
        'username and/or password. Restrictive rate limits are in place. ' +
        '(5 requests/minute)');
    }

    console.log('adapter github issue search: starting for query ' + query);

    var url = 'https://api.github.com/search/issues?q=' + query;
    if (settings && settings.searchRestrictedToUser) {
        url += '+user:' + settings.searchRestrictedToUser;
    }
    var options = {
        url: url,
        headers: {
            'User-Agent': 'search-aggregator',
        },
        json: true,
    };
    console.log('query-url: ' + url);
    if (settings && settings.username && settings.password) {
        options.auth =  {
            user: settings.username,
            pass: settings.password,
            sendImmediately: true,
        };
    }

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
                    excerpt: element.body,
                    timestamp: element.updated_at,
                });
            });
        }
        return callback(null, results);
    });
};
