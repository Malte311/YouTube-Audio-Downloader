'use strict';
/**
 * This file is holding the applications configuration.
 *
 * @module config
 * @author Malte311
 */

/**
 * Specifies if the application is currently running in asar.
 */
const isRunningInAsar = require('electron-is-running-in-asar');

module.exports = {
	devMode: !isRunningInAsar()
}