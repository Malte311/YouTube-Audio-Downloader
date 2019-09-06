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
		myChannels = data.channels;
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
	for (const channel of myChannels) {
		var chData = getChannelData(channel);
		displayChannelCard('my-channels', chData.chId, chData.thumbnail, chData.chTitle, true);
	}
}

function getChannelData(channelId) {

}

function getMultipleChannelData(channelIds) {

}

function addChannel(channel) {
	myChannels.push(channel);
	saveMyChannels();
}

function removeChannel(channel) {
	saveMyChannels();
}