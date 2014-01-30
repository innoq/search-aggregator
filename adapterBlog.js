var request = require("request");
var cheerio = require('cheerio');


module.exports = function (query, settings, callback) {

	console.log(settings.username);

	var auth = {
		'auth': {
			'user': settings.username,
			'pass': settings.password,
			'sendImmediately': false
		}
	}

	request.get(settings.url + "/blogging/search?q=" + query, auth, function (error, response, body) {
		if (!error && response.statusCode == 200) {
	  		$ = cheerio.load(body);
	  		var results = [];
	  		var articles = $('article').children('h2').each(function(i, elem){
	  			var href = $(this).children('a').attr('href');
				var textline = $(this).children('a').text();
				var result = {title: textline, url: settings.url + href}
				results.push(result);
	  		});
	    	callback(null, results);
		}
	})
};

