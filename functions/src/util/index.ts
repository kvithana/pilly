import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

/**
 * Get Firestore user data for a user
 * @param id user id
 * @throws if user is not in database
 */
export const getUser = async (id: string): Promise<undefined | UserProfileData> => {
  const data = admin
    .firestore()
    .doc(`users/${id}`)
    .get()
    .then((snapshot) => snapshot.data() as undefined | UserProfileData)
    .catch((e) => {
      functions.logger.error('error with read user', e)
      throw new functions.https.HttpsError('internal', 'firestore read error')
    })

  if (!data) {
    // account data not found in Firestore
    throw new functions.https.HttpsError('internal', 'account not found')
  }
  return data
}
