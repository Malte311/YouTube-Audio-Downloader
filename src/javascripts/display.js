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
		<div class="card" id="${cardId}" style="width: 18rem;">
			<img src="${cardImg}" class="card-img-top">
			<div class="card-body">
				<h5 class="card-title">${cardTitle}</h5>
				<a href="#" class="btn btn-success">Download new videos</a>
				<a href="#" class="btn btn-success">Download all videos</a>
				<a href="#" class="btn btn-outline-danger">Remove channel</a>
			</div>
		</div>
	`);
}

/**
 * Displays the search results whenever a search is done.
 * 
 * @param {string} parentId The id of the element where the card should be inserted.
 * @param {string} cardId The id of the new card.
 * @param {string} cardImg The path to the image inside the card.
 * @param {string} cardTitle The title of the card.
 * @param {string} cardText The text of the card.
 * @param {bool} append Specifies whether the card should be appended to the parent element or not.
 */
function displaySearchResultCard(parentId, cardId, cardImg, cardTitle, cardText, append) {
	if (!append)
		$(`#${parentId}`).html('');
	
	$(`#${parentId}`).append(`
		<div class="card" id="${cardId}" style="width: 18rem;">
			<img src="${cardImg}" class="card-img-top">
			<div class="card-body">
				<h5 class="card-title">${cardTitle}</h5>
				<p class="card-text">${cardText}</p>
				<a href="#" class="btn btn-success">Add to my channels</a>
			</div>
		</div>
	`);
}