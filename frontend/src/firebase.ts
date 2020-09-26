import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/functions'

const app = firebase.initializeApp({
  apiKey: 'AIzaSyBKMMHSyLMSMc5iqoItPgxUlJJTFJEV65Q',
  authDomain: 'codebrew-bs.firebaseapp.com',
  databaseURL: 'https://codebrew-bs.firebaseio.com',
  projectId: 'codebrew-bs',
  storageBucket: 'codebrew-bs.appspot.com',
  messagingSenderId: '7867687218',
  appId: '1:7867687218:web:8726a2afe0a272e52e372b',
})

const auth = app.auth()
const functions = app.functions('australia-southeast1')
const storage = app.storage()
const firestore = app.firestore()

if (process.env.NODE_ENV !== 'production') {
  functions.useFunctionsEmulator('http://localhost:5001')
}

export { firebase, app, auth, functions, storage, firestore }
