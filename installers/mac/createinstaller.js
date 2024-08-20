// const createMacInstaller = require('electron-installer-dmg').createMacInstaller
// const path = require('path')

// getInstallerConfig()
//   .then(createMacInstaller)
//   .catch((error) => {
//     console.error(error.message || error)
//     process.exit(1)
//   })

// function getInstallerConfig () {
//   console.log('creating mac installer')
//   const rootPath = path.join('./')
//   const outPath = path.join(rootPath, 'mac-release-builds')

//   return Promise.resolve({
//     appDirectory: path.join(outPath, 'RPOSAPP-darwin-x64/'),
//     authors: 'Kaustav Naskar',
//     noMsi: true,
//     outputDirectory: path.join(outPath, 'mac-installer'),
//     exe: 'RPOSAPP.exe',
//     setupExe: 'RPOSAPPINSTALLER.exe',
//     setupIcon: path.join(rootPath, 'dist','assets', 'icons','favicon.png.ico'),
//     description: 'RPOS APP'
//   })
// }

var electronInstaller = require('electron-installer-dmg');
const path = require('path')
const rootPath = path.join('./')
const outPath = path.join(rootPath, 'mac-release-builds')

resultPromise = electronInstaller.createMacInstaller({
  appDirectory: path.join(outPath, 'RPOS-App-darwin-x64/'),
  outputDirectory:  path.join(outPath, 'mac-installer'),
  authors: 'Kaustav Naskar.',
  exe: 'RPOS-App.icns'
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));