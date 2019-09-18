# YouTube-Audio-Downloader
This application allows you to download audio tracks from YouTube videos. Moreover, you can
add channels which are interesting to you and download all new videos. The application automatically
keeps track of new videos for you.

***
## Installation
You can get the latest version of this application [here](https://github.com/Malte311/YouTube-Audio-Downloader/releases).
Simply download the correct `ZIP`-archive and unzip it.

***
## Usage
In order to use this application, you need a YouTube API key. You can get a key by following this steps:
- Create a Google account in case you have no account yet.
- Go to https://console.developers.google.com/ and create a new project.
- Click on 'Activate API' and add the _YouTube Data API v3_.
- Navigate to 'Credentials' and choose 'Create credentials' -> 'API key'.
This application stores your API key only on your computer after you typed it in. You should not expose your API key to the public.

After you added an API key via the 'settings' button in this application, you are ready to go. If you want to download a single video,
you can simply paste the full URL of that video into the search field in the 'Download single video' section and click on 'Download'.
For downloading multiple videos at once, you have to add channels to your channel list first. Simply search for the channel you want to
add in the 'Add channel' section. Then add this channel to your channel list. When you click on the 'Add channel' button, you have to
choose a starting point for that channel. This means you have to choose from which video on you would like to download the videos of
this channel. If you want all videos, simply continue without selecting a starting point. Now that you have a non-empty channel list,
you can download the new videos for each channel (or even for all channels at once) by clicking on the corresponding button.

***
## Further
### Documentation
An auto-generated JSDoc documentation can be found [here](https://malte311.github.io/YouTube-Audio-Downloader/).

### Licence
This project is licensed under the [MIT License](https://github.com/Malte311/YouTube-Audio-Downloader/blob/master/LICENSE).