'use strict';

var hbs = require('express-hbs');
var async = require('async');
var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

// configuration for all environments
app.set('port', process.env.PORT || 3000);

// Use `.hbs` for extensions and find partials in `views/partials`.
app.engine('hbs', hbs.express3({
  partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

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
try {
  var config = require('./config');
} catch (e) {
  debugger;
  if (e.code && e.code === 'MODULE_NOT_FOUND') {
    console.error('ERROR: Could not load config.js. Please copy "config.js.template" to "config.js", customize "config.js" to fit your needs and try again.');
  } else {
    console.error('ERROR: There was an error while loading config.js. Did you screw that file up? Is it a valid module?');
    console.error(e);
  }
  process.exit(1);
}

var adaptors = [];
for (var name in config.adaptors) {
	var adaptor = require(name);
	var settings = config.adaptors[name];
	adaptors.push({
    adaptor: adaptor,
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
  getResults(req, function(err, resultArrays) {
    if (err) { return internalServerError(res); }
    console.log('Writing JSON result');
		res.writeHead(200, { 'Content-Type': 'application/json' });
    // TODO Still some code duplication in produceJson and produceHtml

    // TODO each element of resultsArray is an array of results from one
    // aggregator, so this will write an array of arrays which is not what we
    // want.
		res.end(JSON.stringify(resultArrays));
    console.log('Finished writing JSON result');
  });
}

function produceHtml(req, res) {
  console.log('...Html');
  getResults(req, function(err, resultArrays, query) {
    if (err) { return internalServerError(res); }
    console.log('Rendering HTML result');

    var resultCount = resultArrays.reduce(function(prev, elem) {
      return prev + elem.length;
    }, 0);

    var paras = {
      title: 'Search Aggregator',
      heading: 'Search Results',
      query: query,
      resultArrays: resultArrays,
      resultCount: '' + resultCount,
      hasResults: resultCount > 0
    };
    console.log('paras: '+JSON.stringify(paras));
    res.render('search', paras);

    console.log('Finished rendering HTML result');
  });
}

function getResults(req, produceResponse) {
	var query = req.param('query');

  if (!query) {
    return produceResponse(null, [], null);
  }

  var tasks = adaptors.map(function(adaptorConfig) {
    return function(cb) {
      console.log('Querying next adapter');
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
    console.log('Aggregating adapter results');
    return produceResponse(err, results, query);
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
