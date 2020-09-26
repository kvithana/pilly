import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import * as z from 'zod'
import { extractText } from './_vision'
import { extract } from './entity-extraction'
import { descend } from 'ramda'

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const InputSchema = z.object({
  bucket: z.string(),
  path: z.string(),
  id: z.string(),
})

export function register(builder: functions.FunctionBuilder) {
  return {
    analyse: builder.https.onCall(async (data, context) => {
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

      const filepath = 'gs://' + input.bucket + '/' + input.path

      const result = await extractText(filepath)

      await firestore
        .collection('ocr')
        .doc(input.id)
        .set({
          file: filepath,
          text: result.fullTextAnnotation?.text || null,
        })

      if (result.fullTextAnnotation?.text) {
        const entities = await extract(result.fullTextAnnotation.text)

        const medicationTitle =
          entities
            .filter((entity) => entity.label === 'MedicationTitle')
            .sort(descend((entity) => entity.confidence))[0] || null

        const activeIngredient =
          entities
            .filter((entity) => entity.label === 'ActiveIngredient')
            .sort(descend((entity) => entity.confidence))[0] || null

        const doseFrequency =
          entities
            .filter((entity) => entity.label === 'DoseFrequency')
            .sort(descend((entity) => entity.confidence))[0] || null

        const dosage =
          entities.filter((entity) => entity.label === 'Dosage').sort(descend((entity) => entity.confidence))[0] || null

        console.log(entities)

        console.log(medicationTitle)
        console.log(doseFrequency)
        console.log(dosage)
        console.log(activeIngredient)

        const doseFrequencyNumber = doseFrequency ? findNumber(doseFrequency.text) : 1
        const dosageNumber = dosage ? findNumber(dosage.text) : 1

        if (medicationTitle) {
          return {
            medicationTitle: medicationTitle.text,
            doseFrequencyNumber,
            dosageNumber,
          }
        }
      }

      return null
    }),
  }
}

function findNumber(str: string): number {
  const match = str.match(/(one|two|three|four|five|once|twice|[0-9]+)/i)

  console.log(match && match[1])

  if (match) {
    switch (match[1].toLowerCase()) {
      case 'one':
        return 1
      case 'two':
        return 2
      case 'three':
        return 3
      case 'four':
        return 4
      case 'five':
        return 5
      case 'once':
        return 1
      case 'twice':
        return 2
    }

    const n = parseInt(match[1])
    if (!isNaN(n)) {
      return n
    }
  }

  return 1
}
