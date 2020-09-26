import { createBrowserHistory } from 'history'
import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './app'
import './index.css'
import * as serviceWorker from './serviceWorker'
import './styles/generated/tailwind.css'

// Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css'
// import '@fortawesome/fontawesome-free/js/all.js'

const history = createBrowserHistory()

ReactDOM.render(
  <React.StrictMode>
    <App history={history} />
  </React.StrictMode>,
  document.getElementById('root'),
)

const onUpdateReady = (registration: ServiceWorkerRegistration) => {
  const waitingServiceWorker = registration.waiting

  if (waitingServiceWorker) {
    waitingServiceWorker.addEventListener('statechange', (event) => {
      // @ts-ignore
      if (event?.target?.state === 'activated') {
        window.location.reload()
      }
    })
    waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' })
  }
}

const config = { onUpdate: onUpdateReady }

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register(config)
