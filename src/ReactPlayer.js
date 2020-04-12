import React, { Component, Suspense, lazy } from 'react'

import { propTypes, defaultProps, DEPRECATED_CONFIG_PROPS } from './props'
import { getConfig, omit, isEqual } from './utils'
import players from './players'
import Player from './Player'
import renderPreloadPlayers from './preload'

const FilePlayer = lazy(() => import('./players/FilePlayer'))
const Preview = lazy(() => import('./Preview'))

const SUPPORTED_PROPS = Object.keys(propTypes)
let customPlayers = []

export default class ReactPlayer extends Component {
  static displayName = 'ReactPlayer'
  static propTypes = propTypes
  static defaultProps = defaultProps

  static addCustomPlayer = player => {
    customPlayers.push(player)
  }

  static removeCustomPlayers = () => {
    customPlayers = []
  }

  static canPlay = url => {
    for (const Player of [...customPlayers, ...players]) {
      if (Player.canPlay(url)) {
        return true
      }
    }
    return false
  }

  static canEnablePIP = url => {
    for (const Player of [...customPlayers, ...players]) {
      if (Player.canEnablePIP && Player.canEnablePIP(url)) {
        return true
      }
    }
    return false
  }

  config = getConfig(this.props, defaultProps, true)
  state = {
    showPreview: !!this.props.light
  }

  componentDidMount () {
    if (this.props.progressFrequency) {
      const message = 'ReactPlayer: %cprogressFrequency%c is deprecated, please use %cprogressInterval%c instead'
      console.warn(message, 'font-weight: bold', '', 'font-weight: bold', '')
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState)
  }

  componentDidUpdate (prevProps) {
    const { light } = this.props
    this.config = getConfig(this.props, defaultProps)
    if (!prevProps.light && light) {
      this.setState({ showPreview: true })
    }
    if (prevProps.light && !light) {
      this.setState({ showPreview: false })
    }
  }

  handleClickPreview = () => {
    this.setState({ showPreview: false })
  }

  showPreview = () => {
    this.setState({ showPreview: true })
  }

  getDuration = () => {
    if (!this.player) return null
    return this.player.getDuration()
  }

  getCurrentTime = () => {
    if (!this.player) return null
    return this.player.getCurrentTime()
  }

  getSecondsLoaded = () => {
    if (!this.player) return null
    return this.player.getSecondsLoaded()
  }

  getInternalPlayer = (key = 'player') => {
    if (!this.player) return null
    return this.player.getInternalPlayer(key)
  }

  seekTo = (fraction, type) => {
    if (!this.player) return null
    this.player.seekTo(fraction, type)
  }

  handleReady = () => {
    this.props.onReady(this)
  }

  getActivePlayer (url) {
    for (const player of [...customPlayers, ...players]) {
      if (player.canPlay(url)) {
        return player.Player || player
      }
    }
    // Fall back to FilePlayer if nothing else can play the URL
    return FilePlayer
  }

  wrapperRef = wrapper => {
    this.wrapper = wrapper
  }

  activePlayerRef = player => {
    this.player = player
  }

  renderActivePlayer (url, activePlayer) {
    if (!url) return null
    return (
      <Player
        {...this.props}
        key={url}
        ref={this.activePlayerRef}
        config={this.config}
        activePlayer={activePlayer}
        onReady={this.handleReady}
      />
    )
  }

  sortPlayers (a, b) {
    // Retain player order to prevent weird iframe behaviour when switching players
    if (a && b) {
      return a.key < b.key ? -1 : 1
    }
    return 0
  }

  render () {
    const { url, controls, style, width, height, light, playIcon, wrapper: Wrapper } = this.props
    const showPreview = this.state.showPreview && url
    const otherProps = omit(this.props, SUPPORTED_PROPS, DEPRECATED_CONFIG_PROPS)
    const activePlayer = this.getActivePlayer(url)
    const renderedActivePlayer = this.renderActivePlayer(url, activePlayer)
    const preloadPlayers = renderPreloadPlayers(url, controls, this.config)
    const players = [renderedActivePlayer, ...preloadPlayers].sort(this.sortPlayers)
    const preview = <Preview url={url} light={light} playIcon={playIcon} onClick={this.handleClickPreview} />
    return (
      <Wrapper ref={this.wrapperRef} style={{ ...style, width, height }} {...otherProps}>
        <Suspense fallback={null}>
          {showPreview ? preview : players}
        </Suspense>
      </Wrapper>
    )
  }
}
