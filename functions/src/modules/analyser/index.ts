import * as functions from 'firebase-functions'
import { extractText } from './_vision'

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const analyse = functions.https.onRequest((request, response) => {
  console.log(extractText('gs://codebrew-2020.appspot.com/dL_ZgPIQ-kwiP7-CmdFmJ'))
  functions.logger.info('Hello logs!', { structuredData: true })
  response.send('Hello from Firebase!')
})
