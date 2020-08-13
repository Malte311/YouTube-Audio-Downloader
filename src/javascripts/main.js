'use strict';
/**
 * This is the entry point of our app.
 * It creates the window and loads the index.html file.
 *
 * @module main
 * @author Malte311
 */

/**
 * Electron reference for creating the browser window.
 */
const electron = require('electron');

/**
 * Configuration of this project.
 */
const config = require('./config.js');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

/**
 * Creates the application window.
 */
function createWindow () {
    // Create the browser window
    mainWindow = new electron.BrowserWindow({
        width: electron.screen.getPrimaryDisplay().size.width,
        height: electron.screen.getPrimaryDisplay().size.height,
        icon: electron.nativeImage.createFromPath(__dirname + '../../res/icon.ico'),
        movable: true,
        center: true,
		fullscreen: false,
		webPreferences: {
			enableRemoteModule: true,
			nodeIntegration: true
        }
	});
	
	// and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/../html/index.html');

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });

    electron.Menu.setApplicationMenu(
		electron.Menu.buildFromTemplate(
			require('./electronMenu.js')
		)
	);

	mainWindow.maximize();

	if (config.devMode)
		mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron.app.on('ready', createWindow);

// Quit when all windows are closed.
electron.app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin')
        electron.app.quit()
});

electron.app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null)
    	createWindow()
});