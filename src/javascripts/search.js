/**
 * Handles user searches.
 *
 * @module search
 * @author Malte311
 */

/**
 * Holds the path to the file containing the Google API key.
 */
const API_KEY_PATH = 'api_key.txt';

/**
 * Holds the basic url of the Google API.
 */
const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Searches for a given user input.
 */
function search() {
	var $searchInput = $('#search-input').val();
	var params = `?part=snippet&maxResults=12&type=channel&q=${$searchInput}&key=${getApiKey()}`;

	$('#search-results').html('');
	sendApiRequest('GET', API_BASE_URL + '/search' + params, response => {
		for (var channel of JSON.parse(response).items) {
			displaySearchResultCard(
				'search-results', 
				channel.id.channelId, 
				channel.snippet.thumbnails.medium.url, 
				channel.snippet.channelTitle, 
				channel.snippet.description, 
				true
			);
		}
	});

	return false; // Prevent redirect on form submit
}

/**
 * Sends a request to the google API.
 * 
 * @param {DOMString} method The HTTP method, e.g. GET, POST, PUT, DELETE.
 * @param {DOMString} url The url to which the request should be send.
 * @param {function} callback Callback function which receives the response as a parameter.
 */
function sendApiRequest(method, url, callback) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open(method, url);
	xmlHttp.addEventListener('load', event => {
		if (xmlHttp.status >= 200 && xmlHttp.status < 300)
			callback(xmlHttp.responseText);
	});

	xmlHttp.send();
}

/**
 * Returns the google API key.
 */
function getApiKey() {
	return require('fs').readFileSync(API_KEY_PATH, 'utf-8').replace(/^\s+|\s+$/g, '');
}