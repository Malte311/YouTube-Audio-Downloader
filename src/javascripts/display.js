'use strict';
/**
 * Adds, edits and removes html elements.
 *
 * @module display
 * @author Malte311
 */

/**
 * Adds a card content container for a channel to a given element.
 * 
 * @param {string} parentId The id of the element where the card should be inserted.
 * @param {string} cardId The id of the new card.
 * @param {string} cardImg The path to the image inside the card.
 * @param {string} cardTitle The title of the card.
 * @param {bool} append Specifies whether the card should be appended to the parent element or not.
 */
function displayChannelCard(parentId, cardId, cardImg, cardTitle, append) {
	if (!append)
		$(`#${parentId}`).html('');
	
	$(`#${parentId}`).append(`
		<div class="card" id="${cardId}" style="width: 20rem; margin-right: 10px;">
			<img src="${cardImg}" class="card-img-top">
			<div class="card-body">
				<h5 class="card-title">${cardTitle}</h5>
				<button class="btn btn-outline-success dwnld" 
						onclick="toggleDownloadButtons(); downloadVideosFromChannel('${cardId}')">
					Download new videos
				</button>
				<button class="btn btn-outline-danger" onclick="removeChannel('${cardId}')">
					Remove
				</button>
			</div>
		</div>
	`);
}

/**
 * Displays the search results whenever a search is done.
 * 
 * @param {string} parentId The id of the element where the card should be inserted.
 * @param {string} cardId The id of the new card (which is also the channel id).
 * @param {string} cardImg The path to the image inside the card.
 * @param {string} cardTitle The title of the card.
 * @param {string} cardText The text of the card.
 * @param {bool} append Specifies whether the card should be appended to the parent element or not.
 */
function displaySearchResultCard(parentId, cardId, cardImg, cardTitle, cardText, append) {
	if (!append)
		$(`#${parentId}`).html('');
	
	$(`#${parentId}`).append(`
		<div class="card my-auto" id="${cardId}" style="width:18rem; height:550px;
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
	$(`#${parentId}`).append(`
		<div class="card border-success my-auto" id="${channelId}" style="width:240px; height:350px;
				display:inline-block; margin-right:15px;">
			<img src="${cardImg}" class="card-img-top" width="128px" height="128px">
			<div class="card-body">
				<p class="card-text">${cardTitle}</p>
				<button class="btn btn-outline-success" style="position:absolute; bottom:15px;"
						onclick="setStartTime(this, '${startTime}')">
					Set as start
				</button>
			</div>
		</div>
	`);
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
 * Displays a message that no channels are currently in use.
 */
function displayEmptyChannelList() {
	$('#my-channels').html(`
		<div class="alert alert-primary" role="alert"
				style="width:50%; margin:auto; text-align:center; margin-top:20px;">
			You have no channels added to your list yet!
	  	</div>
	`);
}

/**
 * Displays a message that no results for the query were found.
 */
function displayEmptySearchResults() {
	$('#search-results').html(`
		<div class="alert alert-primary" role="alert"
				style="width:50%; margin:auto; text-align:center; margin-top:20px;">
			No results found.
	  	</div>
	`);
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
		`Downloading video ${currentNum} of ${totalNum} from channel ${channelName}...` :
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
 * Displays a message which says that there are no new videos available. The message is removed
 * after a few seconds.
 */
function displayNoNewVideosMessage() {
	$('#dl-progress').html(`
		<div class="alert alert-danger" role="alert"
				style="width:50%; margin:auto; text-align:center; margin-top:20px;">
			No new videos available!
		</div>
	`);

	setTimeout(() => {
		$('#dl-progress').html('');
	}, 3000);
}

/**
 * Displays a message that all downloads have been completed.
 * 
 * @param {string} divId The id of the div in which the progress should be displayed.
 */
function displayDownloadsComplete(divId) {
	$(`#${divId}`).html(`
		<div class="alert alert-success" role="alert"
				style="width:50%; margin:auto; text-align:center; margin-top:20px;">
			All downloads have been completed!
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
 * Disables all download buttons while downloading and enables them when no downloads are active.
 */
function toggleDownloadButtons() {
	$('.dwnld').prop('disabled', !$('.dwnld').prop('disabled'));
}