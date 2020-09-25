import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/functions'

const app = firebase.initializeApp({
  apiKey: 'AIzaSyCUcaWwjMGI5Tua7ecPXmIUekW8PjasoiQ',
  authDomain: 'codebrew-2020.firebaseapp.com',
  databaseURL: 'https://codebrew-2020.firebaseio.com',
  projectId: 'codebrew-2020',
  storageBucket: 'codebrew-2020.appspot.com',
  messagingSenderId: '338256134689',
  appId: '1:338256134689:web:7b73ca66500da7f1941960',
})

const auth = app.auth()
const functions = app.functions('asia-northeast1')
const storage = app.storage()
const firestore = app.firestore()

if (process.env.NODE_ENV !== 'production') {
  functions.useFunctionsEmulator('http://localhost:5001')
}

export { firebase, app, auth, functions, storage, firestore }
