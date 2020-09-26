interface UserProfileData extends firebase.firestore.DocumentData {
  lmao: string
  notificationTokens: NotificationTokenData[]
}

interface NotificationTokenData {
  token: string
  deviceTitle: string
  created: firebase.firestore.Timestamp
}

interface UserMedicationData extends firebase.firestore.DocumentData {
  notificationTimes: string[]
  notificationsEnabled: boolean
  title: string
}

/**
 * Notification data object sent through PubSub to the notification handler.
 */
interface PubSubNotificationData {
  type: 'REMIND'
  uid: string // user's Firebase UID
  notificationData?: {
    drugName: string
  }
}
