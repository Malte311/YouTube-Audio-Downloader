# YouTube-Audio-Downloader

This application allows you to download audio tracks (in `.m4a` format) from YouTube videos. Moreover, you can
add channels which are interesting to you and download all new videos. The application automatically
keeps track of new videos for you.

***
## Installation
You can get the latest version of this application [here](https://github.com/Malte311/YouTube-Audio-Downloader/releases).
Simply download the correct `ZIP`-archive and unzip it.

***
## Usage
In order to use this application, you need a _YouTube API key_. You can get a key by following this steps:

- Create a Google account in case you have no account yet.
- Go to https://console.developers.google.com/ and create a new project.
- Click on 'Activate API' and add the _YouTube Data API v3_.
- Navigate to 'Credentials' and choose 'Create credentials' -> 'API key'.

This application stores your API key **only on your computer** after you typed it in. You should **not** expose your API key to the public.
After you added an API key via the 'settings' button in this application, you are ready to go.

<p align="center">
  <img src="https://github.com/Malte311/YouTube-Audio-Downloader/blob/master/res/my_channels.png">
</p>

For downloading multiple videos at once, you have to add channels to your channel list first.
Simply search for the channel you want to add in the 'Add channel' section (see below).

<p align="center">
  <img src="https://github.com/Malte311/YouTube-Audio-Downloader/blob/master/res/add_channel.png">
</p>

You can use the search formular to search for channels you would like to add.
When you click on the 'Add channel' button, you have to choose a starting point for that channel.
This means you have to choose from which video on you would like to download the videos of this channel.
If you want all videos, simply continue without selecting a starting point.

<p align="center">
  <img src="https://github.com/Malte311/YouTube-Audio-Downloader/blob/master/res/single_download.png">
</p>

If you want to download a single video, you can simply paste the full URL of that video into the search field in the
'Download single video' section and click on 'Download'.

***
## Further
### Documentation
An auto-generated JSDoc documentation can be found [here](https://malte311.github.io/YouTube-Audio-Downloader/).

### Licence
This project is licensed under the [MIT License](https://github.com/Malte311/YouTube-Audio-Downloader/blob/master/LICENSE).
