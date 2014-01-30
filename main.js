'use strict';

var express = require("express");
var async = require("async");

var port = 3000;
var app = express();
var config = require("./config");

var adaptors = [];

for (var name in config.adaptors) {
	var adaptor = require(name);
	var settings = config.adaptors[name];
	adaptors.push({
    adaptor: adaptor,
    settings: settings,
  });
}

app.get("/", function(req, res) {
  produceResult(res, req);
});

console.log("Listening on port " + port);
app.listen(port);


// TODO:
// adaptOr or adaptEr? Both is correct, but we should agree on one or the other
// :-)  (My preference: I think adapter is more widely used but I don't really
// care)

function produceResult(res, req) {
  for (var i = 0; i < req.accepted.length; i++) {
    switch (req.accepted[i].subtype) {
      case "json":
        console.log("Json...");
        return produceJson(req, res);
      case "html":
        console.log("Html...");
        return produceHtml(req, res);
    }
  }
  return notAccepted(res);
}

function produceJson(req, res) {
  console.log("...Json");
  getResults(req, function(err, resultArrays) {
    if (err) { return internalServerError(res); }
    console.log("Writing JSON result");
		res.writeHead(200, { "Content-Type": "application/json" });
    // TODO Still some code duplication in produceJson and produceHtml

    // TODO each element of resultsArray is an array of results from one
    // aggregator, so this will write an array of arrays which is not what we
    // want.
		res.end(JSON.stringify(resultArrays));
    console.log("Finished writing JSON result");
  });
}

function produceHtml(req, res) {
  console.log("...Html");
  getResults(req, function(err, resultArrays) {
    if (err) { return internalServerError(res); }
    console.log("Writing HTML result");
		res.writeHead(200, { "Content-Type": "text/html" });
    // TODO Still some code duplication in produceJson and produceHtml

    // TODO Replace by jade template. For now, just pump the stuff into a plain
    // vanilla html string.

    // Each element of resultsArray is an array of results from one aggregator
    res.write('<html><head></head><body><ul>');
    for (var i = 0; i < resultArrays.length; i++) {
      var aggregatorResult = resultArrays[i];
      for (var j = 0; j < aggregatorResult.length; j++) {
		    res.write('<li><h3>' + aggregatorResult[j].title + '</h3></li>');
        res.write('<ul>');
		    res.write('<li><a href="' + aggregatorResult[j].url + '">'
          + aggregatorResult[j].url + '</a></li>');
		    res.write('<li>' + aggregatorResult[j].timestamp + '</li>');
        res.write('</ul>');
      }
    }
    res.write('</ul></body></html>');
    res.end();
    console.log("Finished writing HTML result");
  });
}

function getResults(req, produceResponse) {
	var query = req.param("query");

	var tasks = adaptors.map(function(adaptorConfig) {
		return function(cb) {
      console.log("Querying next adapter");
			adaptorConfig.adaptor(query, adaptorConfig.settings, cb);
		};
	});

	// TODO: error handling (timeout?)

  // TODO: Maybe switch to an event based protocol between the aggregator and
  // the adapters? Actually, I think the following pattern would be a godd fit:
  // - each adapter is an event emitter
  // - for each new result, the adaptor emits an event
  // - the aggregator receives the event and can then push one more result
  //   to the consumer.

	async.parallel(tasks, function(err, results) {
    console.log("Aggregating adapter results");
    produceResponse(err, results);
	});
}

function notAccepted(res) {
  console.log("not accepted");
  res.writeHead(406);
  res.end();
}

function internalServerError(res) {
  console.log("internal server error");
  res.writeHead(500, { "Content-Type": "text/plain" });
  res.end("Sorry, something went wrong.");
}
