import * as firebase from 'firebase';
const firebaseConfig = {
  apiKey: "AIzaSyBqHAu_ywlwkAFqX228XY-ny0PbLNNagpo",
  authDomain: "ojek-apps.firebaseapp.com",
  databaseURL: "https://ojek-apps.firebaseio.com",
  projectId: "ojek-apps",
  storageBucket: "ojek-apps.appspot.com",
  messagingSenderId: "1060042604495",
  appId: "1:1060042604495:web:98fb3ebe6f45e571e6dcba",
  measurementId: "G-0RKVP2D71T"
};

firebase.initializeApp(firebaseConfig);

export default firebaseConfig;