# Install wine to run package-win
npm install wine-darwin
# Setup ~/.wine by running a command
./node_modules/.bin/wine hostnamene

npm install

npm run package-win
zip -r -9 application/YouTube-Audio-Downloader-win32-x64.zip application/YouTube-Audio-Downloader-win32-x64

npm run package-linux
zip -r -9 application/YouTube-Audio-Downloader-linux-x64.zip application/YouTube-Audio-Downloader-linux-x64

npm run package-mac
npm run create-dmg

# Documentation, generated in directory ./out
jsdoc -R readme.md -r ./src/javascripts
