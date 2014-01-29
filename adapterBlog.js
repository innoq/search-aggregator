var request = require("request")

var auth = {
  'auth': {
    'user': 'frank',
    'pass': 'innoq01',
    'sendImmediately': false
	}
}


module.exports = function (query, callback) {
	request.get('https://internal.innoq.com/blogging/search?q=vodafone', auth, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	      callback(null, body);
	  }
	})
};



//https://internal.innoq.com/blogging/search?q=vodafone


