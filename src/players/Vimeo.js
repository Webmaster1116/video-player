import React, { Component } from 'react'

import { callPlayer, getSDK } from '../utils'
import createSinglePlayer from '../singlePlayer'

const SDK_URL = 'https://player.vimeo.com/api/player.js'
const SDK_GLOBAL = 'Vimeo'
const MATCH_URL = /vimeo\.com\/.+/
const MATCH_FILE_URL = /vimeo\.com\/external\/[0-9]+\..+/

export class Vimeo extends Component {
  static displayName = 'Vimeo'
  static forceLoad = true // Prevent checking isLoading when URL changes
  static canPlay = url => {
    if (MATCH_FILE_URL.test(url)) {
      return false
    }
    return MATCH_URL.test(url)
  }

  callPlayer = callPlayer
  duration = null
  currentTime = null
  secondsLoaded = null
  load (url) {
    this.duration = null
    getSDK(SDK_URL, SDK_GLOBAL).then(Vimeo => {
      if (!this.container) return
      this.player = new Vimeo.Player(this.container, {
        url,
        autoplay: this.props.playing,
        muted: this.props.muted,
        loop: this.props.loop,
        playsinline: this.props.playsinline,
        ...this.props.config.vimeo.playerOptions
      })
      this.player.ready().then(() => {
        const iframe = this.container.querySelector('iframe')
        iframe.style.width = '100%'
        iframe.style.height = '100%'
      }).catch(this.props.onError)
      this.player.on('loaded', () => {
        this.props.onReady()
        this.refreshDuration()
      })
      this.player.on('play', () => {
        this.props.onPlay()
        this.refreshDuration()
      })
      this.player.on('pause', this.props.onPause)
      this.player.on('seeked', e => this.props.onSeek(e.seconds))
      this.player.on('ended', this.props.onEnded)
      this.player.on('error', this.props.onError)
      this.player.on('timeupdate', ({ seconds }) => {
        this.currentTime = seconds
      })
      this.player.on('progress', ({ seconds }) => {
        this.secondsLoaded = seconds
      })
    }, this.props.onError)
  }

  refreshDuration () {
    this.player.getDuration().then(duration => {
      this.duration = duration
    })
  }

  play () {
    const promise = this.callPlayer('play')
    if (promise) {
      promise.catch(this.props.onError)
    }
  }

  pause () {
    this.callPlayer('pause')
  }

  stop () {
    this.callPlayer('unload')
  }

  seekTo (seconds) {
    this.callPlayer('setCurrentTime', seconds)
  }

  setVolume (fraction) {
    this.callPlayer('setVolume', fraction)
  }

  setLoop (loop) {
    this.callPlayer('setLoop', loop)
  }

  setPlaybackRate (rate) {
    this.callPlayer('setPlaybackRate', rate)
  }

  mute = () => {
    this.setVolume(0)
  }

  unmute = () => {
    if (this.props.volume !== null) {
      this.setVolume(this.props.volume)
    }
  }

  getDuration () {
    return this.duration
  }

  getCurrentTime () {
    return this.currentTime
  }

  getSecondsLoaded () {
    return this.secondsLoaded
  }

  ref = container => {
    this.container = container
  }

  render () {
    const { display } = this.props
    const style = {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: 'black',
      display
    }
    return (
      <div
        key={this.props.url}
        ref={this.ref}
        style={style}
      />
    )
  }
}

export default createSinglePlayer(Vimeo)
