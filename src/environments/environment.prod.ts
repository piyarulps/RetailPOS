let localIp: string = sessionStorage.getItem('localIp');
export const environment = {
  production: true,
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
