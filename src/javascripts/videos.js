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
		downloadVideosFromChannel(channel.channelId, channel.startTime);
	}
}

/**
 * Downloads all new videos for a specific channel.
 * 
 * @param {string} channelId The id of the channel for which we want to download the videos.
 * @param {string} startTime The start time for new videos. Can also be undefined, which means
 * that all videos are new.
 */
function downloadVideosFromChannel(channelId, startTime) {
	getVideos(channelId, startTime, response => {
		response = JSON.parse(response);
		console.log(response)
		var nextPageToken = response.nextPageToken;

		// next request: &pageToken=${nextPageToken} (while nextPageToken != undefined)
		
		for (const item of response.items) {
			var videoLink = `https://www.youtube.com/watch/?v=${item.id.videoId}`;
			var newestDate = new Date(item.snippet.publishedAt).getTime();
			var title;
		}
	});
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

	ytdl(videoUrl, {
		quality: 'highestaudio',
		filter: 'audioonly'
	}).pipe(fs.createWriteStream(config.outputPath + title + '.mp3'));
}