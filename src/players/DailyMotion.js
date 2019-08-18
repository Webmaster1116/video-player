import React, { Component } from 'react'

import { callPlayer, getSDK, parseStartTime } from '../utils'
import createSinglePlayer from '../singlePlayer'

const SDK_URL = 'https://api.dmcdn.net/all.js'
const SDK_GLOBAL = 'DM'
const SDK_GLOBAL_READY = 'dmAsyncInit'
const MATCH_URL = /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?(?:(?:dailymotion\.com(?:\/embed)?\/video)|dai\.ly)\/([a-zA-Z0-9]+)(?:_[\w_-]+)?$/

export class DailyMotion extends Component {
  static displayName = 'DailyMotion'
  static canPlay = url => MATCH_URL.test(url)
  static loopOnEnded = true

  callPlayer = callPlayer
  load (url) {
    const { controls, config, onError, playing } = this.props
    const [, id] = url.match(MATCH_URL)
    if (this.player) {
      this.player.load(id, {
        start: parseStartTime(url),
        autoplay: playing
      })
      return
    }
    getSDK(SDK_URL, SDK_GLOBAL, SDK_GLOBAL_READY, DM => DM.player).then(DM => {
      if (!this.container) return
      const Player = DM.player
      this.player = new Player(this.container, {
        width: '100%',
        height: '100%',
        video: id,
        params: {
          controls: controls,
          autoplay: this.props.playing,
          mute: this.props.muted,
          start: parseStartTime(url),
          origin: window.location.origin,
          ...config.dailymotion.params
        },
        events: {
          apiready: this.props.onReady,
          seeked: () => this.props.onSeek(this.player.currentTime),
          video_end: this.props.onEnded,
          durationchange: this.onDurationChange,
          pause: this.props.onPause,
          playing: this.props.onPlay,
          waiting: this.props.onBuffer,
          error: event => onError(event)
        }
      })
    }, onError)
  }

  onDurationChange = () => {
    const duration = this.getDuration()
    this.props.onDuration(duration)
  }

  play () {
    this.callPlayer('play')
  }

  pause () {
    this.callPlayer('pause')
  }

  stop () {
    // Nothing to do
  }

  seekTo (seconds) {
    this.callPlayer('seek', seconds)
  }

  setVolume (fraction) {
    this.callPlayer('setVolume', fraction)
  }

  mute = () => {
    this.callPlayer('setMuted', true)
  }

  unmute = () => {
    this.callPlayer('setMuted', false)
  }

  getDuration () {
    return this.player.duration || null
  }

  getCurrentTime () {
    return this.player.currentTime
  }

  getSecondsLoaded () {
    return this.player.bufferedTime
  }

  ref = container => {
    this.container = container
  }

  render () {
    const { display } = this.props
    const style = {
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      display
    }
    return (
      <div style={style}>
        <div ref={this.ref} />
      </div>
    )
  }
}

export default createSinglePlayer(DailyMotion)
