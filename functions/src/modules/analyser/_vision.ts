import * as functions from 'firebase-functions'
import vision from '@google-cloud/vision'

const client = new vision.ImageAnnotatorClient()

/**
 * Extract text from an image in a location in Google Cloud storage.
 * @param location location of image in bucket `gs://...`
 */
export const extractText = async (location: string) => {
  const [response] = await client.documentTextDetection(location)

  if (response.error) {
    throw new functions.https.HttpsError('internal', response.error.message!, response.error.details)
  }

  return response
}
