'use strict';
/**
 * Handles all operations on videos.
 *
 * @module videos
 * @author Malte311
 */

/**
 * Downloads all new videos.
 */
function downloadAllVideos() {
	disableDownloadButtons();

	asyncArrLoop(myChannels, (channel, inCallback) => {
		let startTime = channel.startTime != undefined ? parseInt(channel.startTime) : undefined;
		downloadVideosFromChannel(channel.channelId, startTime, [], '', inCallback, true);
	}, 0, () => {
		enableDownloadButtons();
		
		if (!myChannels.length)
			displayAlert('dl-progress', 'You have no channels added yet!', 'danger');
		else
			displayAlert('dl-progress', 'All downloads have been completed!', 'success');
	});
}

/**
 * Downloads all new videos for a specific channel.
 * 
 * @param {string} channelId The id of the channel for which we want to download the videos.
 * @param {number} [startTime] The start time for new videos. Can also be undefined, which means
 * that all videos are new.
 * @param {object[]} [queue] Queue containing all videos to download.
 * @param {string} [nextPage] The token for the next page of the search results.
 * @param {function} [callback] Callback function
 * @param {bool} [multi] Specifies if we download videos for multiple channels or not.
 */
function downloadVideosFromChannel(channelId, startTime = undefined, queue = [], nextPage = '', callback, multi = false) {
	disableDownloadButtons();

	let chTitle = myChannels.find(c => c.channelId == channelId).channelTitle;
	displayAlert('dl-progress', `Currently checking channel "${chTitle}"...`, 'info');

	getVideos(channelId, startTime, response => {
		response = JSON.parse(response);

		let first = true, finished = false;
		let oldStartTime = myChannels.find(c => c.channelId == channelId).startTime;
		let newStartTime = oldStartTime;
		for (const item of response.items) {
			let publishTime = new Date(item.snippet.publishedAt).getTime();
			if (first) { // Videos are sorted by release date: First video is the newest
				newStartTime = publishTime;
				first = false;
			}

			if (publishTime < oldStartTime) {
				finished = true;
				break;
			}

			queue.push({
				videoLink: `https://www.youtube.com/watch?v=${item.id.videoId}`,
				videoTitle: item.snippet.title
			});
		}

		if (response.nextPageToken && !finished) {
			downloadVideosFromChannel(channelId, startTime, queue, response.nextPageToken, callback, multi);
		} else {
			let totalDls = queue.length;
			if (!totalDls && !multi) { // No downloads at all
				displayAlert('dl-progress', 'No new videos available!', 'danger');
				enableDownloadButtons();
			}
				
			let curr = 0;
			queue = queue.reverse(); // API call sorts descending by date but we want ascending
			asyncArrLoop(queue, (vid, callback) => {
				downloadVideo(vid.videoLink, totalDls, ++curr, vid.videoTitle, chTitle, callback);
			}, 0, () => {
				setChannelProperty(channelId, 'startTime', newStartTime + 1);

				if (!multi)
					enableDownloadButtons();

				displayAlert('dl-progress', `Downloads for channel "${chTitle}" completed!`, 'success');

				typeof callback === 'function' && callback();
			});
		}
	}, nextPage);
}

/**
 * Downloads a video by its url.
 * 
 * @param {string} url The url of the video we want to download.
 * @param {number} totalDls The number of videos which are going to be downloaded.
 * @param {number} current The number of the current download.
 * @param {string} [title] The title for the video.
 * @param {string} [chTitle] The title of the channel from which we are currently downloading.
 * @param {function} [callback] Callback which is called when the download is completed.
 * @param {bool} [multi] Specifies if there are multiple downloads.
 */
function downloadVideo(url, totalDls, current, title = undefined, chTitle = undefined, callback, multi = true) {
	if (!isValidUrl(url)) { // Can only happen with user input (single downloads)
		createDialog('show-dialog', 'Invalid URL', `${url} is not a valid YouTube URL!`, undefined, true);
		typeof callback === 'function' && callback();
		return;
	}

	if (title == undefined) {
		getVideoTitle(url, response => {
			let newTitle = response != undefined ? response : 'Untitled'; // Avoid endless loops
			downloadVideo(url, totalDls, current, newTitle, chTitle, callback, multi);
		});
	} else {
		title = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
		let video = ytdl(url);
		video.pipe(fs.createWriteStream(`${config.outputPath}${config.autoNumber} - ${title}.m4a`));

		let $divId = multi ? 'dl-progress' : 'dl-progress-single';
		video.on('progress', (chunkLen, done, total) => {
			let progress = Math.round((done / total) * 100);
			displayDownloadProgress($divId, current, totalDls, progress, chTitle);
		});

		video.on('end', () => {
			if (!multi)
				displayAlert($divId, 'Download completed!', 'success');
			
			incAutoNumber(callback);
		});

		video.on('error', err => {
			let msg = `Could not download <a href="${url}">${url}</a>. 
					Wrote log to <code>${config.outputPath}error.txt</code>.`;
			displayAlert($divId, msg, 'danger');

			fs.appendFileSync(config.outputPath + 'error.txt', `${url}\r\n`, 'utf8');

			typeof callback === 'function' && callback();
		});
	}
}