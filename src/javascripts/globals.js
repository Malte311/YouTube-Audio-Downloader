'use strict';
/**
 * Contains global bindings.
 *
 * @module globals
 * @author Malte311
 */

/**
 * Configuration file.
 */
var config = require('../javascripts/config.js');

/**
 * For comparing versions.
 */
const compareVersions = require('compare-versions');

/**
 * For accessing the file system.
 */
const fs = require('fs');

/**
 * For getting the path separator correctly (differs between different operating systems).
 */
const path = require('path')

/**
 * For getting the version of this application.
 */
const { remote } = require('electron');

/**
 * For sending requests to the github api.
 */
const request = require('request');

/**
 * For accessing the local storage.
 */
const storage = require('electron-json-storage');

/**
 * For downloading videos in mp3 format.
 */
const ytdl = require('ytdl-core');

/**
 * Holds the basic url of the Google API.
 */
const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Holds the url to the latest release of this application.
 */
const LATEST_RELEASE = "https://github.com/malte311/YouTube-Audio-Downloader/releases/latest";

/**
 * Holds the url for the package.json of this repository.
 */
const REPO_URL = "https://api.github.com/repos/Malte311/YouTube-Audio-Downloader/contents/package.json";

/**
 * Holds all texts for the application.
 */
const TEXT = require('../../res/text.json.js');

/**
 * Holds the ids of all channels which are currently in use.
 */
var myChannels = [];