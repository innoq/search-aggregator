var request = require("request");
var cheerio = require('cheerio');

var auth = {
	'auth': {
		'user': 'TODO',
		'pass': 'TODO',
		'sendImmediately': false
	}
}

module.exports = function (query, callback) {
	request.get('TODO URL' + query, auth, function (error, response, body) {
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

