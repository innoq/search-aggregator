var request = require("request")
var htmlparser = require("htmlparser");
var JSONPath = require("JSONPath");

var auth = {
  'auth': {
    'user': 'usr',
    'pass': 'pw',
    'sendImmediately': false
	}
}





module.exports = function (query, callback) {
	request.get('url', auth, function (error, response, body) {
	  if (!error && response.statusCode == 200) {

		


		var handler = new htmlparser.DefaultHandler(
		      function (error) { console.log(error); }, { verbose: false, ignoreWhitespace: true }
		    );

		var parser = new htmlparser.Parser(handler);
		parser.parseComplete(body);
		jsonDom = JSON.stringify(handler.dom, null, 2);
		console.log(jsonDom);

	


		var articles = handler.dom.filter(function(element){
			return element.name == "html" ;
		});

	      callback(null, articles);
	  }
	})
};



//{"type":"tag","name":"article","attribs":{"class":"post"},"children":[{"type":"tag","name":"h2","children"