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
 * Displays a message that all downloads have been completed.
 * 
 * @param {string} divId The id of the div in which the progress should be displayed.
 */
function displayDownloadsComplete(divId) {
	displayAlert(divId, 'All downloads have been completed!', 'success');
}

/**
 * Displays a message that no channels are currently in use.
 */
function displayEmptyChannelList() {
	displayAlert('my-channels', 'You have no channels added to your list yet!', 'danger');
}

/**
 * Displays a message that no results for the query were found.
 */
function displayEmptySearchResults() {
	displayAlert('search-results', 'No results found.', 'danger');
}

/**
 * Displays a message which says that there are no new videos available.
 */
function displayNoNewVideosMessage() {
	displayAlert('dl-progress', 'No new videos available!', 'danger');
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
				onclick="disableDownloadButtons(); downloadVideosFromChannel('${cardId}')">
			Download new videos
		</button>
		<button class="btn btn-outline-danger" onclick="removeChannel('${cardId}')">
			Remove
		</button>`;
	displayCard(parentId, cardId, cardImg, cardTitle, cardText);
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
	//displayCard(parentId, cardId, cardImg, cardTitle, cardText);
	
	$(`#${parentId}`).append(`
		<div class="card my-auto" id="${cardId}" style="width:18rem;
				display:inline-block; margin-right:10px; margin-bottom:15px;">
			<img src="${cardImg}" class="card-img-top" width="240px" height="240px">
			<div class="card-body">
				<h5 class="card-title">${cardTitle}</h5>
				<p class="card-text">${cardText}</p>
				<div id="${cardId}-div"></div>
			</div>
		</div>
	`);

	let btnText, _class, props, onclick, style = 'position: absolute; bottom: 15px;';
	if (containsChannel(cardId)) {
		btnText = 'Already added';
		_class = 'btn btn-outline-secondary';
		props = 'disabled';
	} else {
		btnText = 'Add channel';
		_class = 'btn btn-outline-success';
		onclick = () => {
			addChannel(cardId, cardImg, cardTitle, () => {
				$(`#${cardId}-btn`).remove();
				appendButton(`${cardId}-div`, `${cardId}-btn`, 'Already added', undefined,
						'position:absolute; bottom:15px;', 'btn btn-outline-secondary', 'disabled');
			});
		};
	}

	appendButton(`${cardId}-div`, `${cardId}-btn`, btnText, onclick, style, _class, props);
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
	let cardText = `<button class="btn btn-outline-success" style="position:absolute; bottom:15px;"
							onclick="setStartTime(this, '${startTime}')">
						Set as start
					</button>`;
	displayCard(parentId, channelId, cardImg, cardTitle, cardText);
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
		$('card-prev').append('<br>');
		if (response.prevPageToken) {
			appendButton('card-prev', 'prev-btn', 'Previous page', () => {
				createChannelPreview(divId, channelId, response.prevPageToken);
			});
		}

		if (response.nextPageToken) {
			appendButton('card-prev', 'next-btn', 'Next page', () => {
				createChannelPreview(divId, channelId, response.nextPageToken);
			});
		}

		$(`#${divId}`).append('</div>');
	}, pageToken, 10); // Grab the 10 most recent videos
}

/**
 * Appends a button to a given parent element.
 * 
 * @param {string} divId The id of the parent element.
 * @param {string} btnId The id of the new button.
 * @param {string} btnText The text of the new button.
 * @param {function} [onclick] The onclick event for the new button.
 * @param {string} [style] The style for the button.
 * @param {string} [_class] The class for the button.
 * @param {string} [props] Additional properties for the button.
 */
function appendButton(divId, btnId, btnText, onclick, style, _class, props) {
	style = style || 'margin-top: 10px; margin-right: 10px;';
	_class = _class || 'btn btn-outline-success';
	props = props || '';
	$(`#${divId}`).append(`
		<button class="${_class}" id="${btnId}" style="${style}" ${props}>
			${btnText}
		</button>
	`);

	typeof onclick === 'function' && $(`#${btnId}`).click(onclick);
}

/**
 * Displays the help dialog.
 */
function displayHelp() {
	createDialog('show-dialog', 'Help', TEXT['helpDialog'], undefined, true);
}

/**
 * Displays the settings dialog.
 */
function displaySettings() {
	let text = `
		<h5>YouTube API key</h5>
		<input class="form-control mr-sm-2" id="api-select" type="text" value="${config.apiKey}">
		<br>
		<h5>Output directory</h5>
		<input class="form-control mr-sm-2" id="out-select" type="text" value="${config.outputPath}">
	`;
	createDialog('show-dialog', 'Settings', text, () => {
		updateConfig('apiKey', $('#api-select').val());

		if (config.apiKey.length)
			removeErrorMessage();
		else
			displayErrorMessage('You need a YouTube API key in order to use this application!');

		let inputPath = $('#out-select').val();
		fs.access(inputPath, err => {
			if (err)
				createDialog('show-dialog', 'Error', 'This directory does not exist!', undefined, true);
			else
				updateConfig('outputPath', inputPath.endsWith(path.sep) ? inputPath : inputPath + path.sep);
		});
	}, true);
}