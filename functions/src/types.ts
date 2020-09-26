interface UserProfileData extends FirebaseFirestore.DocumentData {
  lmao: string
  notificationTokens: NotificationTokenData[]
}

interface NotificationTokenData {
  token: string
  deviceTitle: string
  created: FirebaseFirestore.Timestamp
}

interface UserMedicationData {
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
