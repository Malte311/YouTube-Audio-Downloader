'use strict';
/**
 * Initializes the application at startup.
 *
 * @module load
 * @author Malte311
 */

/**
 * Configuration file.
 */
var config = require('../javascripts/config.js');

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
		if (err)
			createDialog('show-dialog', 'Error', `Error at loading from local storage:\n${err}`);
		
		config = data.config != undefined ? data.config : config;
		
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
		if (err)
			createDialog('show-dialog', 'Error', `Error at saving to local storage:\n${err}`);

		typeof callback === 'function' && callback();
	});
}