import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import * as z from 'zod'
import { extractText } from './_vision'
import { extract } from './entity-extraction'
import { descend, comparator } from 'ramda'
import fs from 'fs'
import path from 'path'
import Fuse from 'fuse.js'

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

        const medicationTitle = pickMedicationTitle(entities.filter((entity) => entity.label === 'MedicationTitle'))

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
            text: result.fullTextAnnotation.text,
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

let MEDICATION_TITLES: { name: string }[] = []
let fuse: Fuse<{ name: string }> | undefined = undefined

function pickMedicationTitle<T extends { text: string; confidence: number }>(entries: T[]): T | null {
  if (!MEDICATION_TITLES.length) {
    MEDICATION_TITLES = fs
      .readFileSync(path.resolve(__dirname, '../../../MedicationTitle.txt'))
      .toString()
      .split('\n')
      .filter((item) => !!item)
      .map((name) => ({ name }))

    fuse = new Fuse(MEDICATION_TITLES, { includeScore: true, keys: ['name'], minMatchCharLength: 8 })
  }

  const matches = entries.map((entry) => ({
    ...entry,
    searchScore: fuse!.search(entry.text).reduce((acc, result) => Math.max(acc, result.score!), 0),
    numDigits: countDigits(entry.text),
  }))

  const maxLength = entries.reduce((acc, item) => Math.max(acc, item.text.length), 0)
  const maxNumDigits = matches.reduce((acc, item) => Math.max(acc, item.numDigits), 0)
  const maxSearchScore = matches.reduce((acc, item) => Math.max(acc, item.searchScore), 0)

  const sorted = matches.sort(
    descend((entry) =>
      heuristic({
        maxLength,
        maxNumDigits,
        numDigits: entry.numDigits,
        length: entry.text.length,
        predictionConfidence: entry.confidence,
        searchScore: entry.searchScore,
        maxSearchScore,
      }),
    ),
  )

  return sorted[0] || null
}

function heuristic({
  predictionConfidence,
  maxSearchScore,
  length,
  maxLength,
  numDigits,
  maxNumDigits,
  searchScore,
}: {
  predictionConfidence: number
  maxSearchScore: number
  searchScore: number
  length: number
  maxLength: number
  numDigits: number
  maxNumDigits: number
}) {
  return (
    predictionConfidence +
    (numDigits * 0.2) / maxNumDigits +
    (length * 0.3) / maxLength +
    (searchScore * (length / maxLength)) / maxSearchScore
  )
}

function countDigits(str: string) {
  let result = 0
  for (const character of str) {
    if (character.match(/[0-9]/)) {
      result += 1
    }
  }
  return result
}
