import { History } from 'history'
import React from 'react'
import { Route, Router, Switch } from 'react-router-dom'

import { AuthProvider } from './contexts/AuthContext'
import { UserDataProvider } from './contexts/UserDataContext'
import { Home } from './views/home'
import { LandingView } from './views/landing'
import { ScanView } from './views/scan'

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
            <Route path="*">
              <div></div>
            </Route>
          </Switch>
        </Router>
      </UserDataProvider>
    </AuthProvider>
  )
}
