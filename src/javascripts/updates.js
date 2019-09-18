'use strict';
/**
 * Checks for new updates.
 *
 * @module updates
 * @author Malte311
 */

/**
 * Holds the url for the package.json of this repository.
 */
const REPO_URL = "https://api.github.com/repos/Malte311/YouTube-Audio-Downloader/contents/package.json";

/**
 * Holds the url to the latest release of this application.
 */
const LATEST_RELEASE = "https://github.com/malte311/YouTube-Audio-Downloader/releases/latest";

/**
 * For sending requests to the github api.
 */
const request = require('request');

/**
 * For getting the version of this application.
 */
const { remote } = require('electron');

/**
 * For comparing versions.
 */
const compareVersions = require('compare-versions');

(function(){
	let options =  {
        url: REPO_URL,
        headers: {
            "User-Agent": "YouTube-Audio-Downloader by Malte311"
		}
	};
	
	request(options, (err, response, body) => {

		let pckg = JSON.parse(new Buffer(JSON.parse(body).content, 'base64').toString('ascii'));

		if (compareVersions(remote.app.getVersion(), pckg.version) < 0) {
			let msg = 'There is a new version for this application available! Download it now?';
			createDialog('show-dialog', 'New version available', msg, () => {
				remote.shell.openExternal(LATEST_RELEASE);
			});
		}
	});
})();