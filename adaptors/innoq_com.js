module.exports = function(query, callback) {

function googleURI(apiKey, cseID, queryTerms) {
	var query = queryTerms.map(encodeURIComponent).join("%2B");
	return "https://www.googleapis.com/customsearch/v1?key=" + apiKey + "&cx=" +
			cseID + "&q=" + query;
};
