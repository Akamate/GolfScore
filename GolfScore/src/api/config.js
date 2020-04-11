import firebase from 'firebase'
var config = {
    apiKey: "AIzaSyBJ1aYzCbINfmMCZQi1M9Qrhm4wTMoaSMg",
    authDomain: "golfscore-dee3b.firebaseapp.com",
    databaseURL: "https://golfscore-dee3b.firebaseio.com",
    projectId: "golfscore-dee3b",
    storageBucket: "golfscore-dee3b.appspot.com",
    messagingSenderId: "304172387705",
    appId: "1:304172387705:web:c0992d08cf29f3320373a8",
    measurementId: "G-SBSD60WKY0"
};

const app = (!firebase.apps.length) ? firebase.initializeApp(config) : firebase.app() ;
export default app.database()