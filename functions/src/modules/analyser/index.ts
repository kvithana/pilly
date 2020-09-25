import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import * as z from 'zod'
import { extractText } from './_vision'

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const InputSchema = z.object({
  id: z.string(),
})

export const analyse = functions.region('asia-northeast1').https.onCall(async (data, context) => {
  const firestore = admin.firestore()

  let input: z.TypeOf<typeof InputSchema>
  try {
    input = InputSchema.parse(data)
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new functions.https.HttpsError('invalid-argument', err.message, err.errors)
    }
    throw err
  }

  await firestore.collection('ocr').doc('346P4In1VIqPaj6duDRgA').delete()

  let filepath = input.id
  if (filepath.startsWith('/')) {
    filepath = filepath.substr(1)
  }
  filepath = 'gs://codebrew-2020.appspot.com/' + filepath

  const result = await extractText(filepath)

  await firestore.collection('ocr').doc(input.id).set({
    file: filepath,
    text: result.fullTextAnnotation?.text,
  })

  functions.logger.info(result.fullTextAnnotation?.text)

  return null
})
