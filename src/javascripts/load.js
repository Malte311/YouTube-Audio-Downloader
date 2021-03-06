'use strict';
/**
 * Initializes the application at startup.
 *
 * @module load
 * @author Malte311
 */

(function() {
	loadConfig(() => {
		// Loads the saved channels and displays them afterwards.
		loadMyChannels(displayMyChannels);
	});
})();

/**
 * Loads the configuration for this application.
 * @param {function} [callback] Callback which is executed after configuration has been loaded.
 */
function loadConfig(callback) {
	storage.get('config', (err, data) => {
		if (err) {
			let errMsg = `Error at loading from local storage:<br>${err}`;
			createDialog('show-dialog', 'Error', errMsg, undefined, true);
		}
		
		config = (data != undefined && !jQuery.isEmptyObject(data)) ? data : config;

		if (config.apiKey == '')
			displayErrorMessage('You need a YouTube API key in order to use this application!');

		if (config.outputPath == '')
			updateConfig('outputPath', remote.app.getAppPath('downloads'), callback);
		else
			typeof callback === 'function' && callback();
	});
}

/**
 * Updates and stores the configuration for this application in local storage.
 * 
 * @param {string} key The key which should get updated.
 * @param {any} val The new value for the given key.
 * @param {function} [callback] Callback which is executed after the configuration has been saved.
 */
function updateConfig(key, val, callback) {
	config[key] = val;
	storage.set('config', config, err => {
		if (err) {
			let errMsg = `Error at saving to local storage:<br>${err}`;
			createDialog('show-dialog', 'Error', errMsg, undefined, true);
		}

		typeof callback === 'function' && callback();
	});
}