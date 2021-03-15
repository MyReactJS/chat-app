import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config={
    apiKey: "AIzaSyBsQHQH4FQ6hZCvI8cJcwAjR2uV4h5U3a4",
    authDomain: "chat-web-app-d1af7.firebaseapp.com",
    projectId: "chat-web-app-d1af7",
    storageBucket: "chat-web-app-d1af7.appspot.com",
    messagingSenderId: "687424500511",
    appId: "1:687424500511:web:526598169957ec8c17b62a",
    databaseURL: "https://chat-web-app-d1af7-default-rtdb.europe-west1.firebasedatabase.app/",
    storageURL:"gs://chat-web-app-d1af7.appspot.com"
};
const app = firebase.initializeApp(config);
export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();