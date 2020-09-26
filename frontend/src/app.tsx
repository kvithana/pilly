import { History } from 'history'
import React from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import { ScanView } from './views/scan'
import { ReminderView } from './views/reminder'
import { AccountView } from './views/account'

import { Home } from './views/home'
import { LandingView } from './views/landing'

import { AuthProvider } from './contexts/AuthContext'
import { UserDataProvider } from './contexts/UserDataContext'

import { ToastContainer, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function App({ history }: { history: History }) {
  return (
    <AuthProvider>
      <UserDataProvider>
        <div className="absolute">
          <ToastContainer position="top-center" transition={Flip} />
        </div>

        <Router history={history}>
          <Switch>
            <Route path="/" exact>
              <LandingView />
            </Route>
            <Route path="/home" component={Home} />
            <Route path="/scan" component={ScanView} />
            <Route path="/account" component={AccountView} />
            <Route path="/reminder/:medication" component={ReminderView} />
            <Route path="*">
              <div></div>
            </Route>
          </Switch>
        </Router>
      </UserDataProvider>
    </AuthProvider>
  )
}
