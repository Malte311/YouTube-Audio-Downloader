module.exports = {
	"helpDialog": `
		In order to use this application, you need a YouTube API key.
		You can get a key by following this steps:
		<ul>
			<li> Create a Google account in case you have no account yet. </li>
			<li>
				Go to
				<a href="https://console.developers.google.com/">
					https://console.developers.google.com/
				</a>
				and create a new project.
			</li>
			<li> Click on 'Activate API' and add the <em>YouTube Data API v3</em>. </li>
			<li>
				Navigate to 'Credentials' and choose 'Create credentials' -> 'API key'.
			</li>
		</ul>
		This application stores your API key only on your computer after you typed it in.
		You should not expose your API key to the public.
		<br>
		After you added an API key via the 'settings' button in this application, you are
		ready to go. Simply search for the channel you want to add in the 'Add channel'
		section. Then add this channel to your channel list. When you click on the
		'Add channel' button, you have to choose a starting point for that channel.
		This means you have to choose from which video on you would like to download the
		videos of this channel. If you want all videos, simply continue without selecting
		a starting point. Now that you have a non-empty channel list, you can download the
		new videos for each channel (or even for all channels at once) by clicking on the
		corresponding button.
		<br>
		Of course, you can also download single videos. Just copy the full video URL into
		the proper search field and click on 'Download'.`
}