'use strict';
/**
 * Checks for new updates.
 *
 * @module updates
 * @author Malte311
 */

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