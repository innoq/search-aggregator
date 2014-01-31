var request = require('request');

var results = [
    {
        url: 'http://example.com/1',
        title: 'First search result',
        timestamp: 'A few seconds ago',
        excerpt: 'Lorem Ipsum',
    },
    {
        url: 'http://example.com/2',
        title: 'Second search result',
        timestamp: 'Friday last week',
        excerpt: 'Sic Amet',
    },
    {
        url: 'http://example.com/3',
        title: 'Third search result',
        timestamp: 'In the 90s',
        excerpt: 'Consectur',
    },
    {
        url: 'http://example.com/4',
        title: 'Fourth search result',
        timestamp: 'Ages ago',
        excerpt: 'Foobar',
    },
    {
        url: 'http://example.com/5',
        title: 'Fifth search result',
        timestamp: '13th of February, 1278 AD',
        excerpt: 'Baz',
    },
]

module.exports = function (query, settings, callback) {
   console.log('adapter test offline search: starting for query ' + query);
   callback(null, results);
};
