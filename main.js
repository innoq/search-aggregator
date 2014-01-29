var express = require("express");
var async = require("async");

var app = express();
var config = require("./config");

var adaptors = [];
var name;
for(name in config.adaptors) {
	var adaptor = require(name);
	var settings = adaptors[name];
	adaptors.push([adaptor, settings]);
}

app.get("/", function(req, res, next) {
	var query = req.param("query");
	var tasks = adaptors.map(function(adaptor) {
		return function(callback) {
			adaptor(query, callback);
		};
	});

	// TODO: error handling (timeout?)
	async.parallel(tasks, function(err, results) {
		if(err) {
			res.writeHead(500, { "Content-Type": "text/plain" });
			res.end("Sorry, something went wrong.");
			return;
		}
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify(results));
	});
});

app.listen(3000);

function dummyAdaptor(query, callback) {
	setTimeout(function() {
		callback(null, "dummy " + query);
	}, 500);
}
