import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { getCurrentReminders } from './getCurrentReminders'

export function register(builder: functions.FunctionBuilder) {
  return {
    service: builder.pubsub.schedule('every 1 minutes').onRun(async () => {
      // get all users
      const users = await admin
        .firestore()
        .collection('users')
        .get()
        .then((res) => res.docs.map((d) => ({ id: d.id, data: d.data() as UserProfileData })))

      for (const user of users) {
        const messages: admin.messaging.Message[] = []
        const medications = await getCurrentReminders(user.id)

        medications.forEach((med) => {
          const options: NotificationOptions = {
            data: { notificationId: med.id, callback: `/reminder/${med.id}` },
            body: `It's time to take medication ${med.data.title}.`,
          }
          user.data.notificationTokens.forEach((tokenData) => {
            messages.push({
              data: {
                options: JSON.stringify(options),
              },
              token: tokenData.token,
            })
          })
        })

        // send messages
        await admin
          .messaging()
          .sendAll(messages)
          .catch((err) => functions.logger.error(`error with notifying user ${user.id}:`, err))
      }
    }),
  }
}
