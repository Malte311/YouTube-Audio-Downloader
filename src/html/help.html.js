// Could not figure out how to load a plain .html file, so this is a .js file instead.
module.exports = {
	"helpDialog": `
		<h5 class="text-success"> Setup </h5>
		<p>
			In order to use this application, you need a <em>YouTube API key</em>.
			You can get a <em>YouTube API key</em> by following this steps:
		</p>
		<ol>
			<li class="text-success">
				Create a <em>Google account</em> in case you have no account yet.
			</li>
			<li class="text-success">
				Go to
				<a onclick="remote.shell.openExternal('https://console.developers.google.com/')"
						href="#">
					<em class="text-success">https://console.developers.google.com/</em>
				</a>
				and create a new project.
			</li>
			<li class="text-success">
				Click on 'Activate API' and add the <em>YouTube Data API v3</em>.
			</li>
			<li class="text-success">
				Navigate to 'Credentials' and choose 'Create credentials'. Then, select 'API key'.
			</li>
		</ol>
		<p>
			This application stores your API key <u class="text-danger">only on your computer</u>
			after you typed it in. You should not expose your API key to the public!
		</p>
		<p>
			After you added an API key via the 'settings' button in this application, you are
			ready to go.
		</p>
		<h5 class="text-success"> Usage </h5>
		<p>
			The 'My Channels' section contains your personal channel list. This allows you to
			download new videos for your channels without thinking about which videos are new.
			The application will keep track of new videos automatically for you.
		</p>
		<p>
			If you want to add a new channel to your personal channel list, simply use the search
			form inside of the 'Add channel' section. There you can search for the channel you are
			looking for and add this channel to your channel list. Whenever you add a new channel,
			you have to choose a <em>starting point</em> for that channel.<br>
			This means you have to choose from which video on you would like to download the
			videos of this channel. If you want all videos to be downloaded, simply continue
			without selecting a starting point.
		</p>
		<p>
			Of course, you can also download single videos. Just copy the full video URL into
			the proper search field inside of the 'Download single video' section and click on the
			'Download' button.
		</p>
		<h5 class="text-danger"> Problems </h5>
		<p>
			Sometimes, there may occur errors while you attempt to download videos from YouTube.
			Unfortunately, not all videos can be downloaded successfully at the moment.
		</p>
		<p>
			<em>If you face other problems or bugs that you think should get fixed, feel free to
			<a onclick="remote.shell.openExternal('https://github.com/Malte311/YouTube-Audio-Downloader/issues/new/choose')"
					class="text-success" href="#">
				open an issue on GitHub.
			</a>
			Thank you for your engagement!</em>
		</p>
		`
}