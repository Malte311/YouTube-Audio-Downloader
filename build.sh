brew install homebrew/cask-versions/wine-devel # Wine for Windows builds

npm install

npm run package-win
zip -r -9 application/YouTube-Audio-Downloader-win32-x64.zip application/YouTube-Audio-Downloader-win32-x64

npm run package-linux
zip -r -9 application/YouTube-Audio-Downloader-linux-x64.zip application/YouTube-Audio-Downloader-linux-x64

npm run package-mac
npm run create-dmg

# Documentation, generated in directory ./out
jsdoc -R readme.md -r ./src/javascripts
