var request = require("request");
var jsonpath = require('JSONPath').eval;
var cheerio = require('cheerio');

var auth = {
  'auth': {
    'user': 'frank',
    'pass': 'mon001',
    'sendImmediately': false
	}
}

module.exports = function (query, callback) {
	request.get('https://internal.innoq.com/blogging/search?q=' + query, auth, function (error, response, body) {
	  if (!error && response.statusCode == 200) {

	  	$ = cheerio.load(body);

	  	var results = [];

	  	var articles = $('article').children('h2').each(function(i, elem){
	  		var href = $(this).children('a').attr('href');
		 	var textline = $(this).children('a').text();
			var result = {title: textline, url: href}
		 	results.push(result);
	  	});

	    callback(null, results);
	  }
	})
};

