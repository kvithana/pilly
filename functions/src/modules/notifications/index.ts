import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { getCurrentReminders } from './getCurrentReminders'

export function register(builder: functions.FunctionBuilder) {
  return {
    service: builder.pubsub.schedule('every 1 minutes').onRun(async () => {
      // get all users
      // TODO: batch reads for large user base
      const users = await admin
        .firestore()
        .collection('users')
        .get()
        .then((res) => res.docs.map((d) => ({ id: d.id, data: d.data() as UserProfileData })))

      const messagePromises: Promise<admin.messaging.BatchResponse | void>[] = []

      for (const user of users) {
        const messages: admin.messaging.Message[] = []
        try {
          const medications = await getCurrentReminders(user.id)

          // for each medication a user must take now
          medications.forEach((med) => {
            const options: NotificationOptions = {
              data: { notificationId: med.id, callback: `/reminder/${med.id}` },
              body: `It's time to take medication xd ${med.data.title}.`,
            }
            // for each registered device per user
            user.data.notificationTokens.forEach((tokenData) => {
              messages.push({
                data: {
                  options: JSON.stringify(options),
                },
                token: tokenData.token,
              })
            })
          })
        } catch (e) {
          functions.logger.error('error with iterating over users', e)
        }

        // add to promises array
        messagePromises.push(
          admin
            .messaging()
            .sendAll(messages)
            .catch((err) => functions.logger.error(`error with notifying user ${user.id}:`, err)),
        )
      }

      // wait for all notifications to send
      await Promise.all(messagePromises)
    }),
  }
}
