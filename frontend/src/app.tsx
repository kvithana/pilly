import { History } from 'history'
import React from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import { cs } from './cs'
import { ScanView } from './views/scan'
import { LogInView } from './views/login'
import { AuthProvider } from './contexts/AuthContext'
import { UserDataProvider } from './contexts/UserDataContext'

export function App({ history }: { history: History }) {
  return (
    <AuthProvider>
      <UserDataProvider>
        <Router history={history}>
          <Switch>
            <Route path="/" exact>
              <div
                className={cs(
                  'min-h-screen',
                  'flex',
                  'flex-column',
                  'justify-center',
                  'items-center',
                  'bg-brand-primary',
                )}
              >
                <div className={cs('w-48', 'h-24', 'border-2', 'border-black', 'rounded-lg')}></div>
              </div>
            </Route>
            <Route path="/scan" component={ScanView} />
            <Route path="/login" component={LogInView} />
            <Route path="*">
              <div></div>
            </Route>
          </Switch>
        </Router>
      </UserDataProvider>
    </AuthProvider>
  )
}
