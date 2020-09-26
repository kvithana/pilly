import React, { useContext, useState, useEffect } from 'react'
import { cs } from '../cs'
import { AuthContext } from '../contexts/AuthContext'
import { UserDataContext } from '../contexts/UserDataContext'
import { Button } from '../components'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/messaging'
import 'firebase/firestore'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

/**
 * Requests permission to send notifications to the user and
 * updates the relevant Firestore document.
 * @param uid user's musictaste uid
 */
const requestNotificationPermission = async (uid: string) => {
  if (firebase.messaging.isSupported()) {
    return firebase
      .messaging()
      .requestPermission()
      .then(async () => {
        const token = await firebase.messaging().getToken()
        console.log('[Notifications 📲] token:', token)
        let currentTokens = await firebase
          .firestore()
          .collection('users')
          .doc(uid)
          .get()
          .then((d) => d.data() as UserProfileData)
          .then((profile) => profile.notificationTokens)

        if (currentTokens) {
          let index = -1
          for (const [i, device] of Array.from(currentTokens.entries())) {
            if (device.deviceTitle === navigator.userAgent) {
              index = i
            }
          }
          if (index !== -1) {
            currentTokens.splice(index, 1)
          }
          currentTokens.push({
            token,
            created: firebase.firestore.Timestamp.fromDate(new Date()),
            deviceTitle: navigator.userAgent,
          })
        } else {
          currentTokens = [
            {
              token,
              created: firebase.firestore.Timestamp.fromDate(new Date()),
              deviceTitle: navigator.userAgent,
            },
          ]
        }
        console.log('[Notifications 📲] writing:', currentTokens)
        await firebase.firestore().doc(`users/${uid}`).update({
          notificationTokens: currentTokens,
          notificationsEnabled: true,
        })
      })
  } else {
    toast.error('This device is not supported.')
  }
}

export function AccountView() {
  const { currentUser } = useContext(AuthContext)
  const { userProfile } = useContext(UserDataContext)
  const [registrationLoading, setRegistrationLoading] = useState(false)
  const [deviceRegistered, setDeviceRegistered] = useState(false)
  const history = useHistory()

  const tokens = userProfile?.notificationTokens

  useEffect(() => {
    if (tokens) {
      for (const device of tokens) {
        if (device.deviceTitle === navigator.userAgent) {
          setDeviceRegistered(true)
        }
      }
    }
  }, [tokens])

  const enableNotifications = async () => {
    if (currentUser && userProfile) {
      setRegistrationLoading(true)
      requestNotificationPermission(currentUser.uid)
        .then(() => {
          toast("Awesome! I will remind you when it's time to take your meds 💊.")
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => setRegistrationLoading(false))
    }
  }

  const disableNotification = async () => {
    if (currentUser && userProfile) {
      firebase
        .firestore()
        .doc(`users/${currentUser.uid}`)
        .update({ notificationTokens: [], notificationsEnabled: false })
    }
  }

  const handleSignOut = async () => {
    await firebase.auth().signOut()
    setTimeout(() => history.push('/'), 1100)
  }
  if (!currentUser) {
    return <div className={cs('bg-brand-white', 'text-brand-primary', 'flex', 'flex-col', 'min-h-screen')} />
  }
  return (
    <div className={cs('bg-brand-primary', 'text-brand-white', 'flex', 'flex-col')}>
      <div className={cs('h-10')} />
      <div className="p-5" onClick={() => history.goBack()}>
        <i className={cs('fas', 'fa-chevron-left', 'text-brand-white', 'text-2xl', 'mt-10')} />
      </div>
      <div className={cs('h-0')} />

      <div className={cs('p-5 font-bold text-4xl')}>
        Hi, {currentUser.displayName ? currentUser.displayName.split(' ')[0] : 'person'}
        <span role="img" aria-label="wave">
          👋
        </span>
        .
      </div>
      <div className={cs('bg-brand-white', 'rounded-t-lg', 'text-brand-primary', 'flex-grow', 'py-8', 'px-6')}>
        <div>
          <h2 className={cs('font-bold', 'text-2xl', 'tracking-wide', 'mb-3')}>Notifications</h2>
          <p>Register this device to get reminders for when it&apos;s time to take your medication.</p>
          {deviceRegistered ? (
            <Button
              onClick={disableNotification}
              className={cs('w-full', 'mt-5', 'border-red-500', 'border-2', 'text-red-500')}
            >
              Disable Notifications
            </Button>
          ) : (
            <Button onClick={enableNotifications} className={cs('w-full', 'mt-5', 'bg-green-500', 'text-brand-white')}>
              Enable Notifications
            </Button>
          )}
        </div>
        <div>
          <h2 className={cs('font-bold', 'text-2xl', 'tracking-wide', 'mb-3', 'mt-8')}>Install App</h2>
          <p>Install Pilly to your device to quickly see your medications and respond to notifications.</p>
          {}
          <Button
            onClick={() => null}
            className={cs('w-full', 'mt-8', 'border-2', 'border-green-500', 'text-green-500')}
          >
            Install To Device
          </Button>
        </div>

        <div className="mt-12">
          <Button onClick={handleSignOut} className={cs('text-brand-red', 'underline', 'w-full')}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
