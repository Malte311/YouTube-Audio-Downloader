'use strict';
/**
 * Handles all operations on videos.
 *
 * @module videos
 * @author Malte311
 */

/**
 * For downloading videos in mp3 format.
 */
const ytdl = require('ytdl-core');

/**
 * For accessing the file system.
 */
const fs = require('fs');

/**
 * Downloads all new videos.
 */
function downloadAllVideos() {
	for (const channel of myChannels) {
		downloadVideosFromChannel(channel.channelId, parseInt(channel.startTime));
	}
}

/**
 * Downloads all new videos for a specific channel.
 * 
 * @param {string} channelId The id of the channel for which we want to download the videos.
 * @param {number} startTime The start time for new videos. Can also be undefined, which means
 * that all videos are new.
 * @param {object[]} [queue] Queue containing all videos to download.
 * @param {string} [nextPage] The token for the next page of the search results.
 */
function downloadVideosFromChannel(channelId, startTime, queue = [], nextPage = '') {
	getVideos(channelId, startTime, response => {
		response = JSON.parse(response);

		let first = true, finished = false;
		let oldStartTime = myChannels.find(c => c.channelId == channelId).startTime;
		for (const item of response.items) {
			let newStartTime = new Date(item.snippet.publishedAt).getTime();
			if (first) { // Videos are sorted by release date: First video is the newest
				setChannelProperty(channelId, 'startTime', newStartTime);
				first = false;
			}

			if (newStartTime <= oldStartTime) {
				finished = true;
				break;
			}

			queue.push({
				videoLink: `https://www.youtube.com/watch/?v=${item.id.videoId}`,
				videoTitle: item.snippet.title
			});
		}

		if (response.nextPageToken && !finished) {
			downloadVideosFromChannel(channelId, startTime, queue, response.nextPageToken);
		} else {
			let totalDls = queue.length;
			if (!totalDls) { // No downloads at all
				displayNoNewVideosMessage();
				return;
			}
				
			let curr = 0;
			asyncArrLoop(queue, (vid, callback) => {
				let chTitle = myChannels.find(c => c.channelId == channelId).channelTitle;
				downloadVideo(vid.videoLink, totalDls, ++curr, vid.videoTitle, chTitle, callback);
			}, 0);
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
 */
function downloadVideo(url, totalDls, current, title = undefined, chTitle = undefined, callback) {
	if (title == undefined) {
		getVideoTitle(url, response => {
			let newTitle = response != undefined ? response : 'Untitled'; // Avoid endless loops
			downloadVideo(url, totalDls, current, newTitle, chTitle, callback);
		});
	} else {
		let video = ytdl(url); // No options here, because it is way faster!
		video.pipe(fs.createWriteStream(`${config.outputPath}${config.autoNumber} - ${title}.mp3`));

		let $divId = totalDls > 1 ? 'dl-progress' : 'dl-progress-single';
		video.on('progress', (packetLen, done, total) => {
			let progress = Math.round((done / total) * 100);
			displayDownloadProgress($divId, current, totalDls, progress, chTitle);
		});

		video.on('end', () => {
			let n = (parseInt(config.autoNumber) + 1).toString().padStart(config.autoNumLen, '0');
			updateConfig('autoNumber', n, () => {
				typeof callback === 'function' && callback();

				if (current == totalDls) // All downloads completed
					displayDownloadsComplete($divId);
			});
		});
	}
}