import { FunctionBuilder, https } from 'firebase-functions'
import admin from 'firebase-admin'

export function register(builder: FunctionBuilder) {
  return {
    ensure: builder.https.onCall(async (data, context) => {
      if (!context.auth) {
        throw new https.HttpsError('permission-denied', 'You must be signed in to call this endpoint')
      }

      const firestore = admin.firestore()

      const user = await firestore.runTransaction(async (transaction) => {
        const ref = firestore.collection('users').doc(context.auth!.uid)

        let user = await transaction.get(ref).then((snapshot) => snapshot.data() || null)

        if (!user) {
          user = {
            notificationTokens: [],
          }
          transaction.set(ref, user)
        } else {
          transaction.set(ref, {}, { merge: true })
        }

        return user
      })

      return user
    }),
  }
}
