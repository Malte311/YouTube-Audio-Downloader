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
		if (err)
			createDialog('show-dialog', 'Error', `Error at loading from local storage:\n${err}`);
		
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
		if (err)
			createDialog('show-dialog', 'Error', `Error at saving to local storage:\n${err}`);

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
 * @param {function} [callback] Callback which is executed after the channel has been added.
 */
function addChannel(channelId, channelImg, channelTitle, callback) {
	if (!containsChannel(channelId)) {
		confirmAddChannel(channelId, channelTitle, startTime => {
			myChannels.push({
				channelId: channelId,
				channelImg: channelImg,
				channelTitle: channelTitle,
				startTime: startTime
			});
			saveMyChannels(displayMyChannels);
			typeof callback === 'function' && callback();
		});
	}
}

/**
 * Asks the user to confirm adding a new channel and lets him choose a starting point for it.
 * 
 * @param {string} channelId The id of the channel which should be added.
 * @param {string} channelTitle The title of the new channel.
 * @param {function} callback Callback containing the start time for the channel as a parameter.
 */
function confirmAddChannel(channelId, channelTitle, callback) {
	let dialogText = `Select a starting point (exclusive) for the channel "${channelTitle}".
		You can continue without selecting a starting point. In this case, the oldest video will
		be the starting point.<br>`;
	
	createDialog('show-dialog', 'Adding a new channel', dialogText, () => {
		let date = $('.start-time').prop('start-time');
		callback(date != undefined ? (new Date(date)).getTime() : undefined);
	});

	createChannelPreview('show-dialog', channelId, '');
}

/**
 * Removes a channel form the list of channels in use.
 * 
 * @param {string} channelId The id of the channel which should be removed.
 * @param {bool} [confirmed] States if the deletion was confirmed or not. If not, we create
 * a dialog in which the user has to confirm that he wants to delete the channel.
 * @param {function} [callback] Callback which is executed after the channel has been removed.
 * Note: If the user cancels the removal, the callback will not be executed.
 */
function removeChannel(channelId, confirmed = false, callback) {
	if (!confirmed) {
		confirmRemoveChannel(channelId);
		return;
	}

	if (containsChannel(channelId)) {
		myChannels.splice(myChannels.findIndex(e => e.channelId == channelId), 1);
		saveMyChannels(displayMyChannels);
		typeof callback === 'function' && callback();
	}
}

/**
 * Asks the user to confirm that he wants to remove a channel.
 * 
 * @param {string} channelId The id of the channel which should get removed.
 */
function confirmRemoveChannel(channelId) {
	let channelName = myChannels.find(c => c.channelId == channelId).channelTitle;
	let dialogText = `Do you really want to remove the channel "${channelName}"?`;
	createDialog('show-dialog', 'Removing channel', dialogText, () => {
		removeChannel(channelId, true);
	});
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

/**
 * Sets a property for a given channel.
 * 
 * @param {string} channelId The id of the channel for which we want to set the property.
 * @param {string} property The property which we want to set.
 * @param {any} value The new value for the property.
 */
function setChannelProperty(channelId, property, value) {
	var index = myChannels.findIndex(e => e.channelId == channelId);
	myChannels[index][property] = value;
	saveMyChannels();
}