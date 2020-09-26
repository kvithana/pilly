import * as faker from 'faker'
import shuffle from 'shuffle-array'
import path from 'path'
import { format as formatDate } from 'date-fns'
import yargs from 'yargs'
import fs from 'fs-extra'

const Noise = load('Noise')
const MedicationTitle = load('MedicationTitle')
const Dosage = load('Dosage')
const DoseFrequency = load('DoseFrequency')
const ActiveIngredient = load('ActiveIngredient')

const argv = yargs.usage('Usage: $0 <number> --prefix <prefix> --offset <offset> --out-dir <out-dir>').argv

async function main() {
  const outDir = path.resolve(argv.outDir as string)
  const n = parseInt(argv._[0])
  const offset = argv.offset ? parseInt(argv.offset as string) : 0
  const prefix = (argv.prefix as string) || ''

  for (let i = 0; i < n; i++) {
    const filename = path.join(outDir, prefix + (offset + i) + '.json')
    const result = generate()

    await fs.writeFile(filename, JSON.stringify(result, null, 2))
    console.log(filename)
  }

  console.log('Done!')
}

main()

function generate(): AnnnotatedText {
  let phrases: Phrase[] = []

  const noiseCount = 4 + Math.floor(Math.random() * 8)
  for (let i = 0; i < noiseCount; i++) {
    phrases.push({ type: 'Noise', text: pick(Noise) })
  }

  for (let i = 0; i < Math.floor(Math.random() * 4); i++) {
    phrases.push({ type: 'Noise', text: faker.phone.phoneNumber() })
  }

  phrases.push({ type: 'MedicationTitle', text: pick(MedicationTitle) })
  phrases.push({ type: 'Dosage', text: pick(Dosage) })
  phrases.push({ type: 'DoseFrequency', text: pick(DoseFrequency) })
  phrases.push({ type: 'ActiveIngredient', text: pick(ActiveIngredient) })
  phrases.push({ type: 'Noise', text: [faker.name.firstName(), faker.name.lastName()].join(' ') })
  phrases.push({ type: 'Noise', text: ['Dr', faker.name.firstName(), faker.name.lastName()].join(' ') })
  phrases.push({ type: 'Noise', text: formatDate(faker.date.future(), 'dd/MM/yyyy') })

  shuffle(phrases)

  // add newlines
  phrases = phrases.map((phrase, i) => {
    let text = phrase.text

    // Randomly break the text
    if (Math.random() < 0.3) {
      const words = text.split(' ')
      const point = Math.floor(Math.random() * words.length)
      text = words.slice(0, point).join(' ') + '\n' + words.slice(point).join(' ')
    }

    let suffix = '\n'
    // randomly join lines instead of breaking them
    if (Math.random() < 0.4) {
      suffix = ' '
    }

    if (i === phrases.length - 1) {
      // don't add to the last phrase
      suffix = ''
    }

    return {
      ...phrase,
      text: text + suffix,
    }
  })

  const annotations = annotate(phrases).filter((annotation) => annotation.display_name !== 'Noise')
  return {
    annotations,
    text_snippet: {
      content: phrases.map((phrase) => phrase.text).join(''),
    },
  }
}

type Phrase = {
  type: 'Noise' | 'ActiveIngredient' | 'Dosage' | 'DoseFrequency' | 'MedicationTitle'
  text: string
}

function annotate(phrases: Phrase[]): Annotation[] {
  const annotations: Annotation[] = []
  let offset = 0

  for (const phrase of phrases) {
    annotations.push({
      text_extraction: {
        text_segment: {
          start_offset: offset,
          end_offset: offset + phrase.text.length,
        },
      },
      display_name: phrase.type,
    })
    offset += phrase.text.length
  }

  return annotations
}

type Annotation = {
  text_extraction: {
    text_segment: {
      start_offset: number
      end_offset: number
    }
  }
  display_name: string
}

type AnnnotatedText = {
  annotations: Annotation[]
  text_snippet: {
    content: string
  }
}

function load(filename: string) {
  return fs
    .readFileSync(path.resolve(__dirname, '../', filename + '.txt'))
    .toString()
    .split('\n')
    .filter((x) => !!x)
}

function pick(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}
