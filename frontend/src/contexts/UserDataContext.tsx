import React, { useContext, useEffect, useState } from 'react'
import { firestore } from '../firebase'
import logger from '../util/logger'
import { AuthContext } from './AuthContext'

export const UserDataContext = React.createContext<{
  userProfile: UserProfileData | null
  forceSub: () => null | void
}>({ userProfile: null, forceSub: () => null })

export const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null)

  const [_forceSub, _setForceSub] = useState(0)
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    if (currentUser) {
      const unsub = firestore
        .collection('users')
        .doc(currentUser?.uid || '')
        .onSnapshot((doc) => {
          logger.firebaseLogger('new data', doc.data())
          const source = doc.metadata.hasPendingWrites
          if (!source && doc.exists) {
            const data = doc.data()
            setUserProfile(data as UserProfileData)
          }
        })

      return unsub
    }
  }, [currentUser, _forceSub])

  const forceSub = () => _setForceSub(_forceSub + 1)

  return (
    <UserDataContext.Provider
      value={{
        userProfile,
        forceSub,
      }}
    >
      {children}
    </UserDataContext.Provider>
  )
}
