var request = require("request")
var htmlparser = require("htmlparser");


var auth = {
  'auth': {
    'user': 'user',
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

		var articles = handler.dom.;

	      callback(null, handler.dom);
	  }
	})
};



//{"type":"tag","name":"article","attribs":{"class":"post"},"children":[{"type":"tag","name":"h2","children"