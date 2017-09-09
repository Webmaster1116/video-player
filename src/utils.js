import loadScript from 'load-script'
import merge from 'deepmerge'

import { DEPRECATED_CONFIG_PROPS } from './props'

const MATCH_START_QUERY = /[?&#](?:start|t)=([0-9hms]+)/
const MATCH_START_STAMP = /(\d+)(h|m|s)/g
const MATCH_NUMERIC = /^\d+$/

// Parse YouTube URL for a start time param, ie ?t=1h14m30s
// and return the start time in seconds
export function parseStartTime (url) {
  const match = url.match(MATCH_START_QUERY)
  if (match) {
    const stamp = match[1]
    if (stamp.match(MATCH_START_STAMP)) {
      return parseStartStamp(stamp)
    }
    if (MATCH_NUMERIC.test(stamp)) {
      return parseInt(stamp, 10)
    }
  }
  return 0
}

function parseStartStamp (stamp) {
  let seconds = 0
  let array = MATCH_START_STAMP.exec(stamp)
  while (array !== null) {
    const [, count, period] = array
    if (period === 'h') seconds += parseInt(count, 10) * 60 * 60
    if (period === 'm') seconds += parseInt(count, 10) * 60
    if (period === 's') seconds += parseInt(count, 10)
    array = MATCH_START_STAMP.exec(stamp)
  }
  return seconds
}

// http://stackoverflow.com/a/38622545
export function randomString () {
  return Math.random().toString(36).substr(2, 5)
}

// Util function to load an external SDK
// or return the SDK if it is already loaded
export function getSDK (url, sdkGlobal, sdkReady = null, isLoaded = () => true) {
  if (window[sdkGlobal] && isLoaded(window[sdkGlobal])) {
    return Promise.resolve(window[sdkGlobal])
  }
  return new Promise((resolve, reject) => {
    if (sdkReady) {
      const previousOnReady = window[sdkReady]
      window[sdkReady] = function () {
        if (previousOnReady) previousOnReady()
        resolve(window[sdkGlobal])
      }
    }
    loadScript(url, err => {
      if (err) reject(err)
      if (!sdkReady) {
        resolve(window[sdkGlobal])
      }
    })
  })
}

export function getConfig (props, defaultProps, showWarning) {
  let config = merge(defaultProps.config, props.config)
  for (let p of DEPRECATED_CONFIG_PROPS) {
    if (props[p]) {
      const key = p.replace(/Config$/, '')
      config = merge(config, { [key]: props[p] })
      if (showWarning) {
        const link = 'https://github.com/CookPete/react-player#config-prop'
        const message = `ReactPlayer: %c${p} %cis deprecated, please use the config prop instead – ${link}`
        console.warn(message, 'font-weight: bold', '')
      }
    }
  }
  return config
}
