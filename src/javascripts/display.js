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
		<div class="card" id="${cardId}" style="width: 20rem; margin-right:10px;">
			<img src="${cardImg}" class="card-img-top">
			<div class="card-body">
				<h5 class="card-title">${cardTitle}</h5>
				<button class="btn btn-outline-success" 
						onclick="downloadVideosFromChannel('${cardId}')">
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
	
	var btnText;
	if (containsChannel(cardId)) {
		btnText = `
			<button class="btn btn-outline-secondary"
					style="position:absolute; bottom:15px;" disabled>
				Already added
			</a>
		`;
	} else {
		btnText = `
			<button class="btn btn-outline-success"
					onclick="addChannel('${cardId}', '${cardImg}', '${cardTitle}')"
					style="position:absolute; bottom:15px;">
				Add channel
			</button>
		`;
	}

	$(`#${parentId}`).append(`
		<div class="card my-auto" id="${cardId}" style="width:18rem; height:550px;
				display:inline-block; margin-right:10px; margin-bottom:15px;">
			<img src="${cardImg}" class="card-img-top" width="240px" height="240px">
			<div class="card-body">
				<h5 class="card-title">${cardTitle}</h5>
				<p class="card-text">${cardText}</p>
				${btnText}
			</div>
		</div>
	`);
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