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
	apiKey: '',
	autoNumber: '0000',
	autoNumLen: 4,
	devMode: !isRunningInAsar(),
	outputPath: './' // Set output path here (make sure the directory exists)
}