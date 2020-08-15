// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyBNJSFSl888_95iKXhB-_uJchPerWzb3XE",
    authDomain: "gopulse-71176.firebaseapp.com",
    databaseURL: "https://gopulse-71176.firebaseio.com",
    projectId: "gopulse-71176",
    storageBucket: "gopulse-71176.appspot.com",
    messagingSenderId: "265300354494",
    appId: "1:265300354494:web:1527f58b2f46b5f82445ef",
    measurementId: "G-NLZCPK65G4"
  },
  newsApi: {
    topicsUrl: "https://gnews.io/api/v3/topics/",
    topNewsUrl: "https://gnews.io/api/v3/top-news",
    searchUrl: "https://gnews.io/api/v3/search?q=",
    tokenURL: "?&token=",
    key: "c4931a014b7fd1f739c2f493b08d751a"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
