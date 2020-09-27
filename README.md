# Pilly

A project for Codebrew 2020 by BrightSeeds. Pilly is an AI-powered medication tracker, hosted on a fully serverless stack powered by [Vercel](https://vercel.com) and [Google Cloud Platform](https://cloud.google.com).

### Overview

This monorepo is made up of three packages. Note that the Frontend repository uses `yarn` and Functions targets Node v10 using `npm`. 

#### Frontend

The Pilly webapp is a React PWA hosted on Vercel and connected to our backend services through [Firebase Cloud Functions](https://firebase.google.com/products) and the [Firebase Firestore](https://firebase.google.com/products). 

Commits to master will automatically build through Vercel.

#### Functions

Backend services, targeting [Firebase Cloud Functions](https://firebase.google.com/products). Interfaces with GCP products such as Pub/Sub, [Cloud AutoML](https://cloud.google.com/automl) and [Cloud Vision](https://cloud.google.com/vision). 

We use Cloud Vision to extract text segments from the image, then parse it through a custom-built AutoML model built to determine which segments of the text represent the medication title, active ingredients, dosage and frequency. We then try to match the medications with our own sourced internal database and other heuristic models to better improve our prediction accuracy.

Deploy to backend production using Firebase CLI `firebase deploy --only functions`. Use the emulator to test locally `firebase emulators:start`.

#### Prescription Generator

Generates fake prescription text for training the entity extraction model on Cloud AutoML.
