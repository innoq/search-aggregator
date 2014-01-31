var EventEmitter = require('events').EventEmitter;
var request = require('request');
var util = require('util');

// All github search APIs have a rate limit of 5 requests per minute for
// unauthicated requests. Providing basic auth or OAuth credentials would
// definitely help, raising the rate limit to 20 requests per minute.

function AdapterGithubIssues(settings) {
  this.settings = settings;
}

util.inherits(AdapterGithubIssues, EventEmitter);

AdapterGithubIssues.prototype.search = function(query) {
    console.log('adapter github issue search: starting for query ' + query);
    var self = this;

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
            return self.emit('done', error);
	      } else if (response.statusCode != 200) {
	          console.log('Unexpected HTTP status: ' + response.status);
            return self.emit('done',
              new Error('Unexpected HTTP status: ' + response.status));
        }
        var results = [];
        console.log('adapter github issue search: processing results for query ' + query);
        if (body && body.items) {
            body.items.forEach(function(element) {
                self.emit('result', {
                    url: element.html_url,
                    title: element.title,
                    excerpt: element.body,
                    timestamp: element.updated_at,
                });
            });
        }
        return self.emit('done');
    });
};

module.exports = AdapterGithubIssues;
