import { PropTypes } from 'react'

export const propTypes = {
  url: PropTypes.string,
  playing: PropTypes.bool,
  loop: PropTypes.bool,
  controls: PropTypes.bool,
  volume: PropTypes.number,
  width: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  height: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  hidden: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  progressFrequency: PropTypes.number,
  soundcloudConfig: PropTypes.shape({
    clientId: PropTypes.string
  }),
  youtubeConfig: PropTypes.shape({
    playerVars: PropTypes.object,
    preload: PropTypes.bool
  }),
  vimeoConfig: PropTypes.shape({
    iframeParams: PropTypes.object,
    preload: PropTypes.bool
  }),
  fileConfig: PropTypes.shape({
    attributes: PropTypes.object
  }),
  onReady: PropTypes.func,
  onStart: PropTypes.func,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onBuffer: PropTypes.func,
  onEnded: PropTypes.func,
  onError: PropTypes.func,
  onDuration: PropTypes.func,
  onProgress: PropTypes.func
}

export const defaultProps = {
  playing: false,
  loop: false,
  controls: false,
  volume: 0.8,
  width: 640,
  height: 360,
  hidden: false,
  progressFrequency: 1000,
  soundcloudConfig: {
    clientId: 'e8b6f84fbcad14c301ca1355cae1dea2'
  },
  youtubeConfig: {
    playerVars: {},
    preload: false
  },
  vimeoConfig: {
    iframeParams: {},
    preload: false
  },
  fileConfig: {
    attributes: {}
  },
  onReady: function () {},
  onStart: function () {},
  onPlay: function () {},
  onPause: function () {},
  onBuffer: function () {},
  onEnded: function () {},
  onError: function () {},
  onDuration: function () {},
  onProgress: function () {}
}
