const SHOW_LOGS = true

const accountError = (...rest: Array<undefined | string | number | Record<string, unknown>>) => {
  SHOW_LOGS && console.error(`[ACCOUNT 🙆‍♂️]:`, ...rest)
}

const accountLog = (...rest: Array<undefined | string | number | Record<string, unknown>>) => {
  SHOW_LOGS && console.log(`[ACCOUNT 🙆‍♂️]:`, ...rest)
}

const firebaseLogger = (...rest: Array<any>) => {
  SHOW_LOGS && console.log(`[FIREBASE 🔥]:`, ...rest)
}

export default {
  accountError,
  accountLog,
  firebaseLogger,
}
