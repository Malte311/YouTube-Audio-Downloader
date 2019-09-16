'use strict';
/**
 * Handles Google API interactions.
 *
 * @module gapi
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

	sendApiRequest('GET', API_BASE_URL + '/search' + params, response => {
		$('#search-results').html('');
		var items = JSON.parse(response).items;
		for (var channel of items) {
			displaySearchResultCard(
				'search-results', 
				channel.id.channelId, 
				channel.snippet.thumbnails.medium.url, 
				channel.snippet.channelTitle, 
				channel.snippet.description, 
				true
			);
		}

		if (!items.length)
			displayEmptySearchResults();
	});
}

/**
 * Returns a list of new videos for a given channel.
 * 
 * @param {string} channelId The id of the channel for which we want to get the newest videos.
 * @param {number} startTime Timestamp which determines from when on videos are new.
 * @param {function} callback Callback containing the result as a parameter.
 * @param {string} [pageToken] Token for a specific page of the search results.
 */
function getVideos(channelId, startTime, callback, pageToken = '') {
	var params = `?part=snippet&type=video&channelId=${channelId}&maxResults=50&order=date`;
	if (startTime != undefined)
		params += `&publishedAfter=${new Date(startTime)}`;

	if (pageToken.length)
		params += `&pageToken=${pageToken}`;

	params += `&key=${getApiKey()}`;
	
	sendApiRequest('GET', API_BASE_URL + '/search' + params, response => {
		callback(response);
	});
}

/**
 * Finds out the title of a given video.
 * @param {string} videoUrl The url for the video.
 * @param {function} callback Callback containing the title as a parameter.
 */
function getVideoTitle(videoUrl, callback) {
	let videoId = videoUrl.split('?v=')[1];
	let params = `?part=snippet&id=${videoId}&key=${getApiKey()}`;
	sendApiRequest('GET', API_BASE_URL + '/videos' + params, response => {
		callback(JSON.parse(response).items[0].snippet.title);
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