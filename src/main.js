import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import firebase from 'firebase';

require('firebase/firestore');

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAoXdxZOg1JcPQP1xsdDVuzbElx061FmQ4',
  authDomain: 'finalproject-8a012.firebaseapp.com',
  projectId: 'finalproject-8a012',
  storageBucket: 'finalproject-8a012.appspot.com',
  messagingSenderId: '1072398136003',
  appId: '1:1072398136003:web:94199eedd4a98702262876',
  measurementId: 'G-JFDY1FRPFS',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

//Database'e heryerden ulaşabilmek için
window.db = db;

createApp(App).use(store).use(router).mount('#app');
