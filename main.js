if (require('electron-squirrel-startup')) return;
const setupEvents = require('./installers/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
	// squirrel event handled and app will exit in 1000ms, so don't do anything else
	return;
}

const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const url = require("url");
const developmentMode = true; //true | false

if (developmentMode) { }

let win;

function createWindow() {
	Menu.setApplicationMenu(null);

	win = new BrowserWindow({
		frame: false,
		webPreferences: {
			nodeIntegration: true
		},
		width: 1024,
		height: 768,
		backgroundColor: '#312450',
		show: true,
		icon: developmentMode ? __dirname + '/assets/icons/favicon.png.icns' : __dirname + '/dist/assets/icons/favicon.png.icns',
	});

	// load the dist folder from Angular
	win.loadURL(
		url.format({
			pathname: path.join(__dirname, `/dist/index.html`),
			protocol: "file:",
			slashes: true
		})
	);

	if (developmentMode) {
		// The following is optional and will open the DevTools:
		win.webContents.openDevTools({
			mode: 'undocked',
			activate: false
		});
		// win.maximize();
	}
	else {
		// The following is to prevent opening the DevTools:
		win.webContents.on("devtools-opened", () => { win.webContents.closeDevTools(); });
	}

	win.on("closed", () => {
		win = null;
	});
}

app.on("ready", createWindow);

// on macOS, closing the window doesn't quit the app
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

// initialize the app's main window
app.on("activate", () => {
	if (win === null) {
		createWindow();
	}
});

//  var ElasticSearch = require('./src/app/server/ping.js');
//  ElasticSearch.IndexCreateOnElasticsearch();
