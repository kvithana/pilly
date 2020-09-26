import { History } from 'history'
import React from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import { ScanView } from './views/scan'
import { LoginView } from './views/login'
import { ReminderView } from './views/reminder'

import { Home } from './views/home'
import { LandingView } from './views/landing'

import { AuthProvider } from './contexts/AuthContext'
import { UserDataProvider } from './contexts/UserDataContext'

export function App({ history }: { history: History }) {
  return (
    <AuthProvider>
      <UserDataProvider>
        <Router history={history}>
          <Switch>
            <Route path="/" exact>
              <LandingView />
            </Route>
            <Route path="/home" component={Home} />
            <Route path="/scan" component={ScanView} />
            <Route path="/login" component={LoginView} />
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
