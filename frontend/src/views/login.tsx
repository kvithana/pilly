// Import FirebaseAuth and firebase.
import React, { useMemo } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { cs } from '../cs'
import { auth, firebase } from '../firebase'

export const LoginView = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const config: firebaseui.auth.Config = useMemo(
    () => ({
      // Popup signin flow rather than redirect flow.
      signInFlow: 'redirect',
      // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
      signInSuccess: onLoginSuccess,
      // We will display Google and Facebook as auth providers.
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    }),
    [onLoginSuccess],
  )

  return (
    <div className={cs('container', 'mx-auto')}>
      <StyledFirebaseAuth uiConfig={config} firebaseAuth={auth} />
    </div>
  )
}
