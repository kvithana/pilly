import React, { useEffect, useState } from 'react'
import { firebase, auth, functions } from '../firebase'

export const AuthContext = React.createContext<{
  currentUser: firebase.User | null
  isPending: boolean
}>({ currentUser: null, isPending: false })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPending, setPending] = useState(true)

  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null)
  useEffect(() => {
    const minDelay = delay(1000)

    const unsub = auth.onAuthStateChanged((user) => {
      Promise.all([minDelay, user ? ensureUser() : Promise.resolve()]).then(() => {
        setCurrentUser(user)
        setPending(false)
      })
    })
    return unsub
  }, [])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function ensureUser() {
  await functions.httpsCallable('user-ensure')({})
}
