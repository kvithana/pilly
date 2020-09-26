import React, { useEffect, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
export const AuthContext = React.createContext<{
  currentUser: firebase.User | null
}>({ currentUser: null })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null)
  useEffect(() => {
    firebase.app().auth().onAuthStateChanged(setCurrentUser)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
