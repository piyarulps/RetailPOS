// const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
// const path = require('path')

// getInstallerConfig()
//   .then(createWindowsInstaller)
//   .catch((error) => {
//     console.error(error.message || error)
//     process.exit(1)
//   })

// function getInstallerConfig() {
//   console.log('creating windows installer')
//   const rootPath = path.join('./')
//   const outPath = path.join(rootPath, 'release-builds')

//   return Promise.resolve({
//     appDirectory: path.join(outPath, 'RPOS-App-win32-x64/'),
//     authors: 'RPOS Team',
//     noMsi: true,
//     outputDirectory: path.join(outPath, 'windows-installer'),
//     exe: 'RPOS-App.exe',
//     setupExe: 'RPOSAPPINSTALLER.exe',
//     setupIcon: path.join(rootPath, 'dist', 'assets', 'icons', 'favicon.png.ico'),
//     description: 'RPOS APP'
//   })
//   resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));

// }

var electronInstaller = require('electron-winstaller');
const path = require('path')
const rootPath = path.join('./')
const outPath = path.join(rootPath, 'release-builds')

resultPromise = electronInstaller.createWindowsInstaller({
  appDirectory: path.join(outPath, 'RPOS-App-win32-x64/'),
  outputDirectory: path.join(outPath, 'windows-installer'),
  authors: 'Retailpos Corporation Inc.',
  exe: 'RPOS-App.exe',
  //noMsi:false,
  setupIcon: path.join(rootPath, 'assets', 'icons', 'favicon.png.ico'),
  skipUpdateIcon: true
  // animation: path.join(rootPath, 'assets', 'icons', 'favicon.png'),
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));