/**
 * Initializes the application at startup.
 *
 * @module load
 * @author Malte311
 */

/**
 * Loads all neccessary data.
 */
function load() {
	// Loads the saved channels and displays them afterwards.
	loadMyChannels(displayMyChannels);
}

load();