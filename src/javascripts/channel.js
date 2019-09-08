'use strict';
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
		displayEmptyChannelList();
	} else {
		$('#my-channels').html('');
		for (const ch of myChannels) {
			displayChannelCard('my-channels', ch.channelId, ch.channelImg, ch.channelTitle, true);
		}
	}
}

/**
 * Adds a channel to the list of channels in use.
 * 
 * @param {string} channelId The id of the newly added channel.
 * @param {string} channelImg The thumbnail of the newly added channel.
 * @param {string} channelTitle The title of the newly added channel.
 */
function addChannel(channelId, channelImg, channelTitle) {
	if (!containsChannel(channelId)) {
		myChannels.push({
			channelId: channelId,
			channelImg: channelImg,
			channelTitle: channelTitle
		});
		saveMyChannels(displayMyChannels);
	}
}

/**
 * Removes a channel form the list of channels in use.
 * 
 * @param {string} channelId The id of the channel which should be removed.
 */
function removeChannel(channelId) {
	if (containsChannel(channelId)) {
		myChannels.splice(myChannels.findIndex(e => e.channelId == channelId), 1);
		saveMyChannels(displayMyChannels);
	}
}

/**
 * Checks whether a given channel is already in use or not.
 * 
 * @param {string} channelId The id of the channel for which we want to check if it is in use.
 * @return True if the channel has already been added, otherwise false.
 */
function containsChannel(channelId) {
	return myChannels.findIndex(e => e.channelId == channelId) != -1;
}