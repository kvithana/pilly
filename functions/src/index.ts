import * as functions from 'firebase-functions'
import admin from 'firebase-admin'

import { register } from './modules/analyser'
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp()

const builder = functions.region('australia-southeast1')

export const analyser = register(builder)
