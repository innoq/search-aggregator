var express = require("express");
var async = require("async");
var adapterBlog = require("./adapterBlog");
var adapterGithubIssues = require("./adapter_github_issues");

var ADAPTORS = [dummyAdaptor, adapterGithubIssues] //, adapterBlog];

var app = express();

app.get("/", function (req, res, next) {
	var query = req.param("query");
	var tasks = generateTasks(query);

	// TODO: error handling (timeout?)
	async.parallel(tasks, function(err, results) {
    if (err) {
      console.log('Error in aggregation: ');
      console.log(err);
		  res.writeHead(500, { "Content-Type": "text/plain" });
		  res.end('I fucked up. Sorry.');
      return;
    }
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify(results));
	});
});

app.listen(3000);

function generateTasks(query) {
	return ADAPTORS.map(function(adaptor) {
		return function(callback) {
			adaptor(query, callback);
		};
	});
}

function dummyAdaptor(query, callback) {
	setTimeout(function() {
		callback(null, "dummy " + query);
	}, 500);
}
