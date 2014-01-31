'use strict';

var async = require('async');
var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

// configuration for all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
// serve static assets from public dir
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// TODO:
// adaptOr or adaptEr? Both is correct, but we should agree on one or the other
// :-)  (My preference: I think adapter is more widely used but I don't really
// care)

// read in apapter configuration from config file
var config = require('./config');
var adaptors = [];
for (var name in config.adaptors) {
	var constructor = require(name);
	var settings = config.adaptors[name];
	adaptors.push({
    constructor: constructor,
    settings: settings,
  });
}

app.get('/', function(req, res) {
  produceResult(res, req);
});

http.createServer(app).listen(app.get('port'), function(){
  // Tell the world we're up
  console.log('search-aggregator server listening on port ' + app.get('port'));
});


// TODO All this logic should go to a file of its own, like, say, aggregator.js
// ||||
// vvvv

function produceResult(res, req) {
  for (var i = 0; i < req.accepted.length; i++) {
    switch (req.accepted[i].subtype) {
      case 'json':
        console.log('Json...');
        return produceJson(req, res);
      case 'html':
        console.log('Html...');
        return produceHtml(req, res);
    }
  }
  return notAccepted(res);
}

function produceJson(req, res) {
  console.log('...Json');
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write('[');
  getResults(req, res, renderOneResultJson, writeEndJson);
}

function renderOneResultJson(res, result) {
  if (res._searchAggregatorFirstJsonResultWritten) {
    res.write(',');
  } else {
    res._searchAggregatorFirstJsonResultWritten = true;
  }
  res.write(JSON.stringify(result));
}

function writeEndJson(res) {
  res.write(']');
  res.end();
  console.log('Finished writing JSON result');
}

function produceHtml(req, res) {
  console.log('...Html');

  // write start of page
  res.write('<!DOCTYPE html><html>');
  app.render('head', {
    title: 'Search Aggregator',
  }, function(err, html) {
    console.log('SEARCH HEAD', html);
    res.write(html);
    res.write('<body>');
    app.render('search', {
      title: 'Search Aggregator',
    }, function(err, html) {
      console.log('SEARCH HEADER', html);
      res.write(html);
    });
  });

  // kick of search and write each result as it comes in
  getResults(req, res, renderOneResultHtml, writeEndHtml);
}

function renderOneResultHtml(res, result) {
  app.render('search_result', {
    result: result,
  }, function(err, html) {
    console.log('SEARCH RESULT', html);
    res.write(html);
  });
}

function writeEndHtml(res) {
  res.write('</body></html>');
  res.end();
}

function getResults(req, res, renderOneResult, renderEnd) {
	var query = req.param('query');

  if (!query) {
    return produceResponse(null, [], null);
  }

  var activeAdaptors = [];

	// TODO: error handling & timeouts
  adaptors.forEach(function(adaptorConfig) {

    var Constructor = adaptorConfig.constructor;
    var adaptorName = Constructor.name;
    console.log('Querying next adapter: ' + adaptorName);
    var adaptor = new Constructor(adaptorConfig.settings);
    activeAdaptors.push(adaptor);

    // register listener for result event - each time this adaptor has a new
    // result, we will be notified.
    adaptor.on('result', function(result) {
      console.log('Received result event from ' + adaptorName);
      console.log(JSON.stringify(result, null, 2));
      renderOneResult(res, result);
    });

    // register listener for done event - when the adaptor has finished, we
    // will be notified.
    adaptor.on('done', function() {
      console.log('Received DONE event from ' + adaptorName);
      adaptor.removeAllListeners();
      // remove adaptor from array
      var index = activeAdaptors.indexOf(adaptor);
      activeAdaptors.splice(index, 1);
      // has this been the last adaptor to finish?
      if (activeAdaptors.length === 0) {
        console.log('All adaptors finished, returning results');
        return renderEnd(res);
      }
      console.log('There are still some active adaptors left: ' + JSON.stringify(activeAdaptors));
    });

    // kick of this adaptor's search process and wait for events to arrive
    adaptor.search(query);
	});
}

function notAccepted(res) {
  console.log('not accepted');
  res.writeHead(406);
  res.end();
}

function internalServerError(res) {
  console.log('internal server error');
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('Sorry, something went wrong.');
}
