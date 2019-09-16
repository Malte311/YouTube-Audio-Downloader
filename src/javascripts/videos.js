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
 * Configuration file.
 */
const config = require('../javascripts/config.js');

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
			let totalDownloads = queue.length;
			if (!totalDownloads) { // No downloads at all
				displayNoNewVideosMessage();
				return;
			}
				
			let current = 0;
			asyncArrLoop(queue, (vid, callback) => {
				downloadVideo(vid.videoLink, totalDownloads, ++current, vid.videoTitle, callback);
			}, 0);
		}
	}, nextPage);
}

/**
 * Downloads a video by its url.
 * 
 * @param {string} videoUrl The url of the video we want to download.
 * @param {number} totalDownloads The number of videos which are going to be downloaded.
 * @param {number} current The number of the current download.
 * @param {string} [title] The title for the video.
 * @param {function} [callback] Callback which is called when the download is completed.
 */
function downloadVideo(videoUrl, totalDownloads, current, title = undefined, callback) {
	if (title == undefined)
		title = 'Untitled';

	let video = ytdl(videoUrl); // No options here, because it is way faster!
	video.pipe(fs.createWriteStream(`${config.outputPath}${title}.mp3`));

	let $divId = totalDownloads > 1 ? 'dl-progress' : 'dl-progress-single';
	video.on('progress', (packetLen, done, total) => {
		let progress = Math.round((done / total) * 100);
		displayDownloadProgress($divId, current, totalDownloads, progress);

		if (progress == 100) {
			typeof callback === 'function' && callback();

			if (current == totalDownloads) // All downloads completed
				displayDownloadsComplete($divId);
		}
	});
}

/**
 * Creates an asynchronous array loop, i.e., each iteration waits for the asynchronous call of
 * the last iteration before beginning.
 * 
 * @param {object[]} arr The array we want to iterate over.
 * @param {function} loopFunction The function which does things with the element. Gets two params:
 * (item, callback) where item is the array element and callback is the callback function.
 * @param {number} ind Index for next element to process.
 * @param {function} [callback] Optional callback function, executed after the loop is done.
 */
function asyncArrLoop(arr, loopFunction, ind, callback) {
	if (!(arr.length > 0)) {
		typeof callback === 'function' && callback();
		return;
	}

	var inCallback = loopFunction; // To avoid name conflict
	loopFunction(arr[ind], () => {
		if (++ind < arr.length)
			asyncArrLoop(arr, inCallback, callback, ind);
		else
			typeof callback === 'function' && callback();
	});
}