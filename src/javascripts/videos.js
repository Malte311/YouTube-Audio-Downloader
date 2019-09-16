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

		let oldDate = myChannels.find(c => c.channelId == channelId).startTime;
		for (const item of response.items) {
			let newestDate = new Date(item.snippet.publishedAt).getTime();
			if (oldDate == undefined || newestDate > oldDate) {
				oldDate = newestDate;
				setChannelProperty(channelId, 'startTime', newestDate);
			}

			queue.push({
				videoLink: `https://www.youtube.com/watch/?v=${item.id.videoId}`,
				videoTitle: item.snippet.title
			});
		}

		if (response.nextPageToken) {
			downloadVideosFromChannel(channelId, startTime, queue, response.nextPageToken);
		} else {
			//for (const video of queue)
				//downloadVideo(video.videoLink, video.videoTitle);
		}
	}, nextPage);
}

/**
 * Downloads a video by its url.
 * 
 * @param {string} videoUrl The url of the video we want to download.
 * @param {string} title The title for the video.
 */
function downloadVideo(videoUrl, title = undefined) {
	if (title == undefined)
		title = 'Untitled';

	var video = ytdl(videoUrl, {
		quality: 'highestaudio',
		filter: 'audioonly'
	});

	video.pipe(fs.createWriteStream(config.outputPath + title + '.mp3'));

	video.on('progress', (len, done, total) => {
		console.log(((done / total) * 100).toFixed(2) + '%');
	});
}