import React, { useEffect, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
export const AuthContext = React.createContext<{
  currentUser: firebase.User | null
  isPending: boolean
}>({ currentUser: null, isPending: false })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPending, setPending] = useState(true)

  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null)
  useEffect(() => {
    const minDelay = delay(1000)

    const unsub = firebase
      .app()
      .auth()
      .onAuthStateChanged((user) => {
        minDelay.then(() => {
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
