var request = require('request');

var results = [
    {
        url: 'http://example.com/1',
        title: 'First search result',
        timestamp: 'A few seconds ago',
        excerpt: 'Jemand musste Josef K. verleumdet haben, denn ohne dass er etwas Böses getan hätte, wurde er eines Morgens verhaftet. »Wie ein Hund!« sagte er, es war, als sollte die Scham ihn überleben.',
    },
    {
        url: 'http://example.com/2',
        title: 'Second search result',
        timestamp: 'Friday last week',
        excerpt: 'Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und Konsonantien leben die Blindtexte. Abgeschieden wohnen Sie in Buchstabhausen an der Küste des Semantik, eines großen Sprachozeans. Ein kleines Bächlein namens Duden fließt durch ihren Ort und versorgt sie mit den nötigen Regelialien.',
    },
    {
        url: 'http://example.com/3',
        title: 'Third search result',
        excerpt: 'Und es war ihnen wie eine Bestätigung ihrer neuen Träume und guten Absichten, als am Ziele ihrer Fahrt die Tochter als erste sich erhob und ihren jungen Körper dehnte. »Es ist ein eigentümlicher Apparat«, sagte der Offizier zu dem Forschungsreisenden und überblickte mit einem gewissermaßen bewundernden Blick den ihm doch wohlbekannten Apparat.',
    },
    {
        url: 'http://example.com/4',
        title: 'Fourth search result',
        timestamp: 'Ages ago',
        excerpt: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
    },
    {
        url: 'http://example.com/5',
        title: 'Fifth search result',
        timestamp: '13th of February, 1278 AD',
    },
]

module.exports = function (query, settings, callback) {
   console.log('adapter test offline search: starting for query ' + query);
   callback(null, results);
};
