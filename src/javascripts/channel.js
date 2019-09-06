/**
 * Maintains the channels.
 *
 * @module channel
 * @author Malte311
 */

/**
 * For accessing the local storage.
 */
const storage = require('electron-json-storage');

/**
 * Holds the ids of all channels which are currently in use.
 */
var myChannels = [];

/**
 * Loads all channels which are currently in use from the local storage.
 * 
 * @param {function} [callback] Callback which is called after the channels have been loaded.
 */
function loadMyChannels(callback) {
	storage.get('myChannels', (err, data) => {
		if (err) alert(`Error at loading from local storage:\n${err}`);
		myChannels = data.channels != undefined ? data.channels : [];
		typeof callback === 'function' && callback();
	});
}

/**
 * Saves all channels which are currently in use to the local storage.
 * 
 * @param {function} [callback] Callback which is called after the channels have been saved.
 */
function saveMyChannels(callback) {
	storage.set('myChannels', {
		channels: myChannels
	}, err => {
		if (err) alert(`Error at saving to local storage:\n${err}`);
		typeof callback === 'function' && callback();
	});
}

/**
 * Displays all channels which are currently in use.
 */
function displayMyChannels() {
	if (!myChannels.length) {
		$('#my-channels').html(`
			<div class="alert alert-primary" role="alert" style="width:50%; margin:auto; text-align:center; margin-top:20px;">
				You have no channels added to your list yet!
	  		</div>
		`);
		return;
	} else {
		$('#my-channels').html('');
		for (const channel of myChannels) {
			getChannelData(channel, chData => {
				displayChannelCard('my-channels', chData.chId, chData.thumbnail, chData.chTitle, true);
			});
		}
	}
}

/**
 * Gets the channel data for a channel from the Google API.
 * 
 * @param {string} channelId The id of the channel for which we want to get the channel data.
 * @param {function} callback Callback function containing the channel data as parameter.
 */
function getChannelData(channelId, callback) {
	var params = `?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=${getApiKey()}`;
	sendApiRequest('GET', API_BASE_URL + '/channels' + params, response => {
		var responseToJson = JSON.parse(response);
		callback({
			chId: responseToJson.items[0].id,
			thumbnail: responseToJson.items[0].snippet.thumbnails.medium.url,
			chTitle: responseToJson.items[0].snippet.title
		});
	});
}

/**
 * Adds a channel to the list of channels in use.
 * 
 * @param {string} channelId The id of the newly added channel.
 */
function addChannel(channelId) {
	if (!myChannels.includes(channelId)) {
		myChannels.push(channelId);
		saveMyChannels(displayMyChannels);
	}
}

/**
 * Removes a channel form the list of channels in use.
 * 
 * @param {string} channelId The id of the channel which should be removed.
 */
function removeChannel(channelId) {
	if (myChannels.includes(channelId)) {
		myChannels.splice(myChannels.indexOf(channelId), 1);
		saveMyChannels(displayMyChannels);
	}
}