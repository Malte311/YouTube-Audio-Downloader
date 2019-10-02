'use strict';
/**
 * Adds, edits and removes html elements.
 *
 * @module display
 * @author Malte311
 */

/**
 * Enables all download buttons.
 */
function enableDownloadButtons() {
	$('.dwnld').prop('disabled', false);
}

/**
 * Disables all download buttons.
 */
function disableDownloadButtons() {
	$('.dwnld').prop('disabled', true);
}

/**
 * Displays an error message in the navbar.
 * 
 * @param {string} msg The error message.
 */
function displayErrorMessage(msg) {
	$('#error-msg').html(`<a href="#" onclick="displayHelp()" class="badge badge-danger">${msg}</a>`);
}

/**
 * Removes the error message from the navbar.
 */
function removeErrorMessage() {
	$('#error-msg').html('');
}

/**
 * Displays an alert in a given element.
 * 
 * @param {string} id The id of the element in which the alert should be displayed.
 * @param {string} text The text for the alert.
 */
function displayAlert(id, text, color = 'primary') {
	$(`#${id}`).html(`
		<div class="alert alert-${color}" role="alert"
				style="width:50%; margin:auto; text-align:center; margin-top:20px;">
			${text}
	  	</div>
	`);
}

/**
 * Displays a card (content container) with the given information.
 * 
 * @param {string} parentId The id of the parent element to which the card should be appended.
 * @param {string} cardId The id of the card.
 * @param {string} cardImg The image path for the card.
 * @param {string} [cardTitle] The title for the card.
 * @param {string} [cardText] The text for the card.
 */
function displayCard(parentId, cardId, cardImg, cardTitle, cardText) {
	$(`#${parentId}`).append(`
		<div class="card" id="${cardId}" style="width: 14rem; margin-left: 5px; margin-right: 5px;">
			<img src="${cardImg}" class="card-img-top">
			<div class="card-body">
				${cardTitle != undefined ? `<h5 class="card-title">${cardTitle}</h5>` : ''}
				${cardText != undefined ? `<p class="card-text">${cardText}</p>` : ''}
			</div>
		</div>
	`);
}

/**
 * Adds a card content container for a channel to a given element.
 * 
 * @param {string} parentId The id of the element where the card should be inserted.
 * @param {string} cardId The id of the new card.
 * @param {string} cardImg The path to the image inside the card.
 * @param {string} cardTitle The title of the card.
 */
function displayChannelCard(parentId, cardId, cardImg, cardTitle) {
	let cardText =
		`<button class="btn btn-outline-success dwnld" style="margin-bottom: 10px;"
				onclick="downloadVideosFromChannel('${cardId}')">
			Download new videos
		</button>
		<button class="btn btn-outline-danger" onclick="removeChannel('${cardId}')">
			Remove
		</button>`;
	
	displayCard(parentId, cardId, cardImg, cardTitle, cardText);
}

/**
 * Displays a preview card (when adding a new channel for choosing the starting point).
 * 
 * @param {string} parentId The id of the parent element in which the card should be placed.
 * @param {string} cardImg The path to the image inside the card.
 * @param {string} cardTitle The title of the card.
 * @param {string} channelId The id of the channel for which a preview is displayed.
 * @param {string} startTime The start time for this specific card.
 */
function displayPreviewCard(parentId, cardImg, cardTitle, channelId, startTime) {
	let cardText = cardTitle +
		`<br>
		<div style="justify-content: flex-end; display: flex;">
			<button class="btn btn-outline-success" style="position: absolute; bottom: 15px;"
					onclick="setStartTime(this, '${startTime}')">
				Set as start
			</button>
		</div>`;
	
	displayCard(parentId, channelId, cardImg, '', cardText);
}

/**
 * Displays the search results whenever a search is done.
 * 
 * @param {string} parentId The id of the element where the card should be inserted.
 * @param {string} cardId The id of the new card (which is also the channel id).
 * @param {string} cardImg The path to the image inside the card.
 * @param {string} cardTitle The title of the card.
 * @param {string} cardText The text of the card.
 */
function displaySearchResultCard(parentId, cardId, cardImg, cardTitle, cardText) {
	cardText += 
		`<br>
		<div style="justify-content: flex-end; display: flex;">
			<button class="btn btn-outline-success" style="position: absolute; bottom: 15px;"
					onclick="addChannel('${cardId}', '${cardImg}', '${cardTitle}')">
				Add channel
			</button>
		</div>`;

	displayCard(parentId, cardId, cardImg, cardTitle, cardText);
}

/**
 * Displays the download progress.
 * 
 * @param {string} divId The id of the div in which the progress should be displayed.
 * @param {number} currentNum Number of the video which is currently being downloaded.
 * @param {number} totalNum Total number of videos to be downloaded.
 * @param {number} progress Progress of the current download (in percent).
 * @param {string} [channelName] The name of the channel from which we are downloading currently.
 */
function displayDownloadProgress(divId, currentNum, totalNum, progress, channelName) {
	let downloadMessage = channelName != undefined ?
		`Downloading video ${currentNum} of ${totalNum} from channel "${channelName}"...` :
		`Downloading video ${currentNum} of ${totalNum}...`;
	
	$(`#${divId}`).html(`
		<div style="width: 100%;">
			${downloadMessage}
		</div>
		<div class="progress" style="width: 40%; display: block;">
			<div class="progress-bar progress-bar-striped bg-success" style="width: ${progress}%;">
				${progress}%
			</div>
		</div>
	`);
}

/**
 * Creates a preview for a given channel such that the user can choose a starting point.
 * 
 * @param {string} divId The id of the parent element in which the preview should be displayed.
 * @param {string} channelId The id of the channel for which we want to create a preview.
 * @param {string} [pageToken] The page token for the API request.
 */
function createChannelPreview(divId, channelId, pageToken = '') {
	getVideos(channelId, undefined, response => {
		response = JSON.parse(response);

		$(`#card-prev`).remove(); // Reset previous results
		$(`#${divId}`).append(
			'<div id="card-prev" class="row justify-content-center align-self-center">'
		);
		for (const video of response.items) {
			displayPreviewCard(
				'card-prev',
				video.snippet.thumbnails.medium.url,
				video.snippet.title,
				channelId,
				video.snippet.publishedAt
			);
		}

		// For navigating between pages
		$('#card-prev').append('<br>');
		if (response.prevPageToken) {
			$('#card-prev').append(`
				<button class="btn btn-outline-success" style="margin-right: 5px; margin-top: 15px;"
						onclick="createChannelPreview('${divId}', '${channelId}', '${response.prevPageToken}')">
					Previous page
				</button>
			`);
		}

		if (response.nextPageToken) {
			$('#card-prev').append(`
				<button class="btn btn-outline-success"style="margin-top: 15px;"
						onclick="createChannelPreview('${divId}', '${channelId}', '${response.nextPageToken}')">
					Next page
				</button>
			`);
		}

		$(`#${divId}`).append('</div>');
	}, pageToken, 10); // Grab the 10 most recent videos
}

/**
 * Displays the help dialog.
 */
function displayHelp() {
	let helpText = require('../html/help.html.js');
	createDialog('show-dialog', 'Help', helpText['helpDialog'], undefined, true);
}

/**
 * Displays the settings dialog.
 */
function displaySettings() {
	let text =
		`<h5 class="text-success">YouTube API key</h5>
		<input class="form-control mr-sm-2" id="api-select" type="text" value="${config.apiKey}">
		<br>
		<h5 class="text-success">Output directory</h5>
		<input class="form-control mr-sm-2" id="out-select" type="text" value="${config.outputPath}">`;
	
	createDialog('show-dialog', 'Settings', text, () => {
		updateConfig('apiKey', $('#api-select').val());

		if (config.apiKey.length)
			removeErrorMessage();
		else
			displayErrorMessage('You need a YouTube API key in order to use this application!');

		let inPath = $('#out-select').val();
		fs.access(inPath, err => {
			if (err)
				createDialog('show-dialog', 'Error', 'Directory does not exist!', undefined, true);
			else
				updateConfig('outputPath', inPath.endsWith(path.sep) ? inPath : inPath + path.sep);
		});
	}, true);
}

/**
 * Saves the currently selected start time.
 * 
 * @param {object} elem The element which holds the currently selected start time.
 * @param {string} time Start time for this element.
 */
function setStartTime(elem, time) {
	$('.start-time').prop('disabled', false);
	$('.start-time').removeClass('start-time');

	$(elem).addClass('start-time');
	$(elem).prop('start-time', time);
	$(elem).prop('disabled', true);
}