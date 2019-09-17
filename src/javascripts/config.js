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
	apiKey: require('fs').readFileSync('api_key.txt', 'utf-8').replace(/^\s+|\s+$/g, ''),
	autoNumber: '0000',
	autoNumLen: 4,
	devMode: !isRunningInAsar(),
	outputPath: 'C:/Users/Malte/Downloads/' // Set output path here (make sure the directory exists)
}