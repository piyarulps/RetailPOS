// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
let localIp: string = sessionStorage.getItem('localIp');

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyCg2zxNf4sRf3kMO3nsRRkdZ2Lk9aAE3RA",
    authDomain: "rpos-app.firebaseapp.com",
    databaseURL: "https://rpos-app.firebaseio.com",
    projectId: "rpos-app",
    storageBucket: "rpos-app.appspot.com",
    messagingSenderId: "95633886445",
    appId: "1:95633886445:web:467747d685558d2d"
  },
  elasticUrl: 'http://dev.rpos.io:9200',
  mainUrl: 'http://dev.rpos.io:8088/irsbackend/',
  // localUrl: 'http://localhost:52878/'
  localUrl: `http://${localIp}:52878/`
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
