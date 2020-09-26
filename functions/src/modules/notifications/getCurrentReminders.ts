import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { utcToZonedTime, format } from 'date-fns-tz'

/**
 * Gets the medications for a user which they should receive a notification for this minute.
 * @param uid user's uid
 * @param tz user's IANA time zone name
 */
export const getCurrentReminders = async (uid: string, tz = 'Australia/Melbourne') => {
  const zonedDate = utcToZonedTime(new Date(), tz)

  // search for a time like 0915
  const searchString = format(zonedDate, 'kkmm')

  functions.logger.log('searching', searchString)
  // get medications which should be notified on this minute
  const notifyMeds = await admin
    .firestore()
    .collection(`users/${uid}/medications`)
    .where('notificationTimes', 'array-contains', searchString)
    .get()
    .then((meds) => meds.docs.map((med) => ({ id: med.id, data: med.data() as UserMedicationData })))
    .catch((e) => {
      functions.logger.error('error with getting medications for user', e)
      throw e
    })

  functions.logger.info('notifying user', uid, notifyMeds)
  // only return meds with notifications enabled
  return notifyMeds.filter((m) => m.data.notificationsEnabled)
}
