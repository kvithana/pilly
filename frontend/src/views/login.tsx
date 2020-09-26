// Import FirebaseAuth and firebase.
import React, { useMemo } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { Button } from '../components'
import { cs } from '../cs'
import { auth, firebase } from '../firebase'

const provider = new firebase.auth.GoogleAuthProvider()

export const LoginView = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const login = () => {
    auth.signInWithPopup(provider).then((result) => {
      console.log(result)
      onLoginSuccess()
    })
  }

  return (
    <div className={cs('container', 'mx-auto')}>
      <Button onClick={login}>Sign in with Google</Button>
    </div>
  )
}
