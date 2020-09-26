/**
 * Template to inject Firebase messaging into the existing React PWA service worker.
 */

if (!process.env.REACT_APP_FIREBASE_INIT) {
  // if not building in a production environment
  require('dotenv').config()
}

importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js')
importScripts('https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js')

const firebaseConfig = {
  apiKey: 'AIzaSyBKMMHSyLMSMc5iqoItPgxUlJJTFJEV65Q',
  authDomain: 'codebrew-bs.firebaseapp.com',
  databaseURL: 'https://codebrew-bs.firebaseio.com',
  projectId: 'codebrew-bs',
  storageBucket: 'codebrew-bs.appspot.com',
  messagingSenderId: '7867687218',
  appId: '1:7867687218:web:8726a2afe0a272e52e372b',
}

self.addEventListener('message', (event) => {
  // take over from the previous sw immediately (on refresh)
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

workbox.core.clientsClaim()

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST)

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL('/index.html'), {
  blacklist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
})

firebase.initializeApp(firebaseConfig)
if (firebase.messaging.isSupported()) {
  const messaging = firebase.messaging()

  messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', JSON.stringify(payload))
    const notificationTitle = payload.data.title
    let notificationOptions = payload.data.options
    // notificationOptions = {
    //   actions: [{ action: 'view', title: 'View' }],
    //   body: payload.data.body,
    //   icon: payload.data.icon,
    //   requireInteraction: true,
    //   data: { type: payload.data.type, payload: payload.data.payload },
    // }

    return self.registration.showNotification(notificationTitle, notificationOptions)
  })

  //   self.addEventListener('notificationclick', function (event) {
  //     console.log('EVENT', event.notification.data)
  //     const data = event.notification.data
  //     const notification = event.notification

  //     if (data.type === 'NEW_MATCH') {
  //       notification.close()
  //       clients.openWindow(`/match/${data.payload}`)
  //     }
  //   })

  self.addEventListener('notificationclick', function (e) {
    var notification = e.notification
    // var primaryKey = notification.data.transactionId
    var action = e.action

    if (action === 'close') {
      notification.close()
    } else {
      clients.openWindow('http://www.google.com')
      notification.close()
    }
  })

  self.addEventListener('notificationclose', function (e) {
    var notification = e.notification
    var primaryKey = notification.data.notificationId

    console.log('Closed notification: ' + primaryKey)
  })
}
