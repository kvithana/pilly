import * as functions from 'firebase-functions'
import admin from 'firebase-admin'

import * as analyserEndpoints from './modules/analyser'
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp()

export const analyser = analyserEndpoints
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true })
  response.send('Hello from Firebase!')
})
