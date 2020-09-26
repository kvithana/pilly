// Import FirebaseAuth and firebase.
import React from 'react'
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
    <Button invert onClick={login}>
      Sign in
    </Button>
  )
}
