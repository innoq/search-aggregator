var request = require('request');

module.exports = function (query, settings, callback) {
    console.log('adapter LDAP: starting for query ' + query);
    var options = {
    	baseUrl: settings.url,
        url: settings.url+'/'+settings.path.replace("##key##",'displayName').replace("##value##", query),  
        headers: {
            'User-Agent': 'search-aggregator',
        },
		'auth': {
			'user': settings.username,
			'pass': settings.password,
			'sendImmediately': false
		},        
        json: true
    };
    console.log("url: "+options.url); 
	request.get(options, function (error, response, body) {
    if (error) {
        console.log('error: ');
        console.log(error);
        return callback(error);
    } else if (response.statusCode != 200) {
        console.log('Unexpected HTTP status: ' + response.status);
        return callback(new Error('Unexpected HTTP status: ' + response.status));
    }  
    var results = [];    
    console.log('adapter LDAP: processing results for query ' + query);
    if (body && body.users) {
		body.users.forEach(function(element) {
			results.push({
                url: options.baseUrl+'/'+element.links.show.replace('.json', ''),
                title: element.displayName,
                excerpt: element.mobile+' - '+element.mail,
                img: options.baseUrl+element.links.avatar_medium,
                timestamp: element.updated_at,
            });
        });
    } 
    return callback(null, results);
    });
};