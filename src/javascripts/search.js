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
	var params = `?part=snippet&maxResults=10&type=channel&q=${$searchInput}&key=${getApiKey()}`;

	//https://www.googleapis.com/youtube/v3/channels?part=snippet&id='+commaSeperatedList+'&fields=items(id%2Csnippet%2Fthumbnails)


	sendApiRequest('GET', API_BASE_URL + '/search' + params, response => {
		$('#search-results').html('<div class="row">');
		for (var channel of JSON.parse(response).items) {
			$('#search-results').append(`
				<div class="column">
					<div class="content">
						<a href="#" onclick="addChannel('${channel.id.channelId}')">
							<img src="${channel.snippet.thumbnails.medium.url}" style="width:100%">
						</a>
						<h3>${channel.snippet.channelTitle}</h3>
					<p>${channel.snippet.description}</p>
					</div>
				</div>`
			);
		}
		$('#search-results').append('</div>');

		//console.log(response);
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