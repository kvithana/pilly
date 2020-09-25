import * as functions from 'firebase-functions'
import vision from '@google-cloud/vision'

const client = new vision.ImageAnnotatorClient()

/**
 * Extract text from an image in a location in Google Cloud storage.
 * @param location location of image in bucket `gs://...`
 */
export const extractText = async (location: string) => {
  try {
    const response = await client.documentTextDetection(location)
    console.log(response)
    return response[0]
  } catch (e) {
    // log error
    functions.logger.error('error with extracting text from image:', location, e)
    throw e
  }
}
