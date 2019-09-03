/**
 * Handles user searches.
 *
 * @module search
 * @author Malte311
 */

/**
 * Holds the path to the file containing the google API key.
 */
const API_KEY_PATH = 'api_key.txt';

/**
 * Searches for a given user input.
 */
function search() {
	var $searchInput = document.getElementById('search-input').value;

	sendApiRequest('GET', 'https://www.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&forUsername=' + $searchInput + '&key=' + getApiKey(), res => {
		console.log(res);
	});
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