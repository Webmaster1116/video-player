import React from 'react'

import Base from './Base'

const AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i

export default class FilePlayer extends Base {
  static displayName = 'FilePlayer'
  static canPlay (url) {
    return true
  }
  componentDidMount () {
    const { playsinline, onPause, onEnded, onError } = this.props
    this.player.addEventListener('canplay', this.onReady)
    this.player.addEventListener('play', this.onPlay)
    this.player.addEventListener('pause', () => {
      if (this.mounted) {
        onPause()
      }
    })
    this.player.addEventListener('ended', onEnded)
    this.player.addEventListener('error', onError)
    if (playsinline) {
      this.player.setAttribute('playsinline', '')
      this.player.setAttribute('webkit-playsinline', '')
    }
    super.componentDidMount()
  }
  componentWillUnmount () {
    const { onPause, onEnded, onError } = this.props
    this.player.removeEventListener('canplay', this.onReady)
    this.player.removeEventListener('play', this.onPlay)
    this.player.removeEventListener('pause', onPause)
    this.player.removeEventListener('ended', onEnded)
    this.player.removeEventListener('error', onError)
    super.componentWillUnmount()
  }
  load () {
    // Setting the src is handled by render
  }
  play () {
    this.player.play()
  }
  pause () {
    this.player.pause()
  }
  stop () {
    this.player.removeAttribute('src')
  }
  seekTo (fraction) {
    if (fraction === 1) {
      this.pause()
    }
    super.seekTo(fraction)
    this.player.currentTime = this.getDuration() * fraction
  }
  setVolume (fraction) {
    this.player.volume = fraction
  }
  setPlaybackRate (rate) {
    this.player.playbackRate = rate
  }
  getDuration () {
    if (!this.isReady) return null
    return this.player.duration
  }
  getFractionPlayed () {
    if (!this.isReady) return null
    return this.player.currentTime / this.getDuration()
  }
  getFractionLoaded () {
    if (!this.isReady || this.player.buffered.length === 0) return null
    return this.player.buffered.end(0) / this.getDuration()
  }
  renderSource = source => {
    if (typeof source === 'string') {
      return <source key={source} src={source} />
    }
    const { src, type } = source
    return <source key={src} src={src} type={type} />
  }
  renderSources = url => {
    if (url instanceof Array === false) {
      return null
    }
    return url.map(this.renderSource)
  }
  ref = player => {
    this.player = player
  }
  render () {
    const { url, loop, controls, fileConfig } = this.props
    const Media = AUDIO_EXTENSIONS.test(url) || fileConfig.forceAudio ? 'audio' : 'video'
    const style = {
      width: '100%',
      height: '100%',
      display: url ? 'block' : 'none'
    }
    return (
      <Media
        ref={this.ref}
        src={url instanceof Array ? undefined : url}
        style={style}
        preload='auto'
        controls={controls}
        loop={loop}
        {...fileConfig.attributes}>
        {this.renderSources(url)}
      </Media>
    )
  }
}
