/* eslint-disable no-unused-expressions */

import { SoundCloud } from '../../src/players/SoundCloud'
import { YouTube } from '../../src/players/YouTube'
import { Vimeo } from '../../src/players/Vimeo'
import { Wistia } from '../../src/players/Wistia'
import { Twitch } from '../../src/players/Twitch'

const { describe, it, expect } = window

describe('canPlay', () => {
  describe('YouTube', () => {
    it('knows what it can play', () => {
      expect(YouTube.canPlay('youtube.com/watch?v=12345678901')).to.be.true
      expect(YouTube.canPlay('www.youtube.com/watch?v=12345678901')).to.be.true
      expect(YouTube.canPlay('//www.youtube.com/watch?v=12345678901')).to.be.true
      expect(YouTube.canPlay('https://www.youtube.com/watch?v=12345678901')).to.be.true
      expect(YouTube.canPlay('https://www.youtube.com/watch?v=12345678901')).to.be.true
      expect(YouTube.canPlay('http://www.youtube.com/watch?v=12345678901')).to.be.true
      expect(YouTube.canPlay('https://youtube.com/watch?v=12345678901')).to.be.true
      expect(YouTube.canPlay('http://youtube.com/watch?v=12345678901')).to.be.true
      expect(YouTube.canPlay('http://youtu.be/12345678901')).to.be.true
    })

    it('knows what it can\'t play', () => {
      expect(YouTube.canPlay('http://soundcloud.com/artist-name/title-name')).to.be.false
      expect(YouTube.canPlay('http://vimeo.com/1234')).to.be.false
    })
  })

  describe('SoundCloud', () => {
    it('knows what it can play', () => {
      expect(SoundCloud.canPlay('soundcloud.com/artist-name/title-name')).to.be.true
      expect(SoundCloud.canPlay('//soundcloud.com/artist-name/title-name')).to.be.true
      expect(SoundCloud.canPlay('http://soundcloud.com/artist-name/title-name')).to.be.true
      expect(SoundCloud.canPlay('http://soundcloud.com/artist_name/title_name')).to.be.true
      expect(SoundCloud.canPlay('http://snd.sc/artist-name/title-name')).to.be.true
      expect(SoundCloud.canPlay('http://soundcloud.com/artist-only')).to.be.true
    })

    it('knows what it can\'t play', () => {
      expect(SoundCloud.canPlay('https://www.youtube.com/watch?v=12345678901')).to.be.false
      expect(SoundCloud.canPlay('http://vimeo.com/1234')).to.be.false
    })
  })

  describe('Vimeo', () => {
    it('knows what it can play', () => {
      expect(Vimeo.canPlay('vimeo.com/1234')).to.be.true
      expect(Vimeo.canPlay('//vimeo.com/1234')).to.be.true
      expect(Vimeo.canPlay('http://vimeo.com/1234')).to.be.true
      expect(Vimeo.canPlay('https://vimeo.com/1234')).to.be.true
      expect(Vimeo.canPlay('https://www.vimeo.com/1234')).to.be.true
      expect(Vimeo.canPlay('https://vimeo.com/ondemand/tinact/84954874')).to.be.true
      expect(Vimeo.canPlay('https://vimeo.com/channels/staffpicks/40004005')).to.be.true
      expect(Vimeo.canPlay('https://vimeo.com/groups/motion/videos/73234721')).to.be.true
      expect(Vimeo.canPlay('https://vimeo.com/album/3953264/video/166790294')).to.be.true
      expect(Vimeo.canPlay('https://player.vimeo.com/video/40004005')).to.be.true
    })

    it('knows what it can\'t play', () => {
      expect(Vimeo.canPlay('http://soundcloud.com/artist-name/title-name')).to.be.false
      expect(Vimeo.canPlay('https://www.youtube.com/watch?v=1234')).to.be.false
    })
  })

  describe('Wistia', () => {
    it('knows what it can play', () => {
      expect(Wistia.canPlay('fast.wistia.com/medias/e4a27b971d')).to.be.true
      expect(Wistia.canPlay('//fast.wistia.com/medias/e4a27b971d')).to.be.true
      expect(Wistia.canPlay('https://fast.wistia.com/medias/e4a27b971d')).to.be.true
      expect(Wistia.canPlay('http://fast.wistia.com/medias/e4a27b971d')).to.be.true
      expect(Wistia.canPlay('https://fast.wi.st/medias/e4a27b971d')).to.be.true
      expect(Wistia.canPlay('http://fast.wi.st/medias/e4a27b971d')).to.be.true
      expect(Wistia.canPlay('https://fast.wistia.com/embed/e4a27b971d')).to.be.true
      expect(Wistia.canPlay('http://fast.wistia.com/embed/e4a27b971d')).to.be.true
      expect(Wistia.canPlay('https://fast.wi.st/embed/e4a27b971d')).to.be.true
      expect(Wistia.canPlay('http://fast.wi.st/embed/e4a27b971d')).to.be.true
    })

    it('knows what it can\'t play', () => {
      expect(Wistia.canPlay('http://soundcloud.com/artist-name/title-name')).to.be.false
      expect(Wistia.canPlay('http://vimeo.com/1234')).to.be.false
      expect(Wistia.canPlay('https://www.youtube.com/watch?v=1234')).to.be.false
    })
  })

  describe('Twitch', () => {
    it('knows what it can play', () => {
      expect(Twitch.canPlay('twitch.tv/videos/106400740')).to.be.true
      expect(Twitch.canPlay('www.twitch.tv/videos/106400740')).to.be.true
      expect(Twitch.canPlay('//www.twitch.tv/videos/106400740')).to.be.true
      expect(Twitch.canPlay('https://www.twitch.tv/videos/106400740')).to.be.true
      expect(Twitch.canPlay('https://www.twitch.tv/kronovi')).to.be.true
      expect(Twitch.canPlay('https://twitch.tv/videos/106400740')).to.be.true
      expect(Twitch.canPlay('https://twitch.tv/kronovi')).to.be.true
      expect(Twitch.canPlay('https://go.twitch.tv/videos/186996540')).to.be.true
      expect(Twitch.canPlay('https://go.twitch.tv/kronovi')).to.be.true
    })

    it('knows what it can\'t play', () => {
      expect(Twitch.canPlay('http://soundcloud.com/artist-name/title-name')).to.be.false
      expect(Twitch.canPlay('http://vimeo.com/1234')).to.be.false
      expect(Twitch.canPlay('https://www.youtube.com/watch?v=1234')).to.be.false
    })
  })
})
