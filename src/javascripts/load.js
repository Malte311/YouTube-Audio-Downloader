'use strict';
/**
 * Initializes the application at startup.
 *
 * @module load
 * @author Malte311
 */

(function() {
	storage.get('autoNumber', (err, data) => {
		if (err)
			createDialog('show-dialog', 'Error', `Error at loading from local storage:\n${err}`);
		
		autoNumber = data.autoNumber != undefined ? data.autoNumber : '0000';
		
		// Loads the saved channels and displays them afterwards.
		loadMyChannels(displayMyChannels);
	});
})();