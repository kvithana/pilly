import { History } from 'history'
import React from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import { cs } from './cs'
import { ScanView } from './views/scan'

export function App({ history }: { history: History }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact>
          <div className={cs('min-h-screen', 'flex', 'flex-column', 'justify-center', 'items-center')}>
            <div className={cs('w-48', 'h-24', 'border-2', 'border-black', 'rounded-lg')}></div>
          </div>
        </Route>
        <Route path="/scan">
          <ScanView />
        </Route>
        <Route path="*">
          <div></div>
        </Route>
      </Switch>
    </Router>
  )
}
