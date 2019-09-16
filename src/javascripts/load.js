'use strict';
/**
 * Initializes the application at startup.
 *
 * @module load
 * @author Malte311
 */

/**
 * Holds the number for the next download such that all downloads are numbered correctly.
 */
var autoNumber = '0000';

(function() {
	storage.get('autoNumber', (err, data) => {
		if (err) alert(`Error at loading from local storage:\n${err}`);
		autoNumber = data.autoNumber != undefined ? data.autoNumber : '0000';
		
		// Loads the saved channels and displays them afterwards.
		loadMyChannels(displayMyChannels);
	});
})();

/**
 * Adds zeros at the beginning of a string until it has the requested length.
 * 
 * @param {string} str The string which should get modified.
 * @param {number} totalLength The requested total length.
 */
function zeroPad(str, totalLength) {
	for (let i = 0, end = totalLength - str.length; i < end; i++) {
		str = '0' + str;
	}

	return str;
}