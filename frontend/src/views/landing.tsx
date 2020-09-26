import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Loader } from '../components/loader'
import { AuthContext } from '../contexts/AuthContext'
import { cs } from '../cs'
import styles from './landing.module.css'
import { LoginView } from './login'

export function LandingView() {
  const auth = useContext(AuthContext)
  const history = useHistory()

  useEffect(() => {
    if (!auth.isPending && auth.currentUser) {
      history.push('/home')
    }
  }, [auth, history])

  return (
    <div className={cs('min-h-screen', 'bg-brand-secondary', styles.layout, 'pt-16')}>
      <div className={cs('flex', 'flex-column', 'justify-center', 'items-center')}>
        <h1 className={cs('text-3xl', 'font-bold', 'text-center', 'text-brand-primary')}>
          <span className={cs('text-5xl', 'leading-none')}>💊</span>
          <br />
          Pilly
        </h1>
      </div>
      <div
        className={cs(
          'rounded-t-lg',
          'bg-brand',
          'p-10',
          'text-white',
          'flex',
          'items-center',
          'justify-center',
          'flex-col',
        )}
      >
        {auth.isPending ? <Loader color="brand-primary" /> : null}
        {!auth.isPending && !auth.currentUser ? <LoginView onLoginSuccess={() => history.push('/home')} /> : null}
      </div>
    </div>
  )
}
