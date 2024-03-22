import { cssClasses } from '../utils'

const selectors = {
  main: '[data-video="main"]',
  video: '[data-video="video"]',
  controls: '[data-video="controls"]',
  initPlay: '[data-video="init-play"]',
  playPause: '[data-video="play-pause"]',
  fullscreen: '[data-video="fullscreen"]',
  mute: '[data-video="mute"]',
  volume: '[data-video="volume"]',
  iconPlay: '[data-video-icon="play"]',
  iconPause: '[data-video-icon="pause"]',
  iconVolume: '[data-video-icon="volume"]',
  iconVolumeMute: '[data-video-icon="volume-mute"]',
}

const initVolume = 0.7

export const addVideoControls = (videoContainer) => {
  const video = videoContainer.querySelector(selectors.video)

  if (!video) {
    console.error(
      `DOM Element with video :: ${selectors.video} doesn't exist or it's value is equal null.`
    )
    return
  }

  const controls = videoContainer.querySelector(selectors.controls)
  const initPlay = videoContainer.querySelector(selectors.initPlay)
  const playPauseBtn = videoContainer.querySelector(selectors.playPause)
  const fullscreenBtn = videoContainer.querySelector(selectors.fullscreen)
  const muteBtn = videoContainer.querySelector(selectors.mute)
  const volumeBtn = videoContainer.querySelector(selectors.volume)
  const iconPlay = videoContainer.querySelector(selectors.iconPlay)
  const iconPause = videoContainer.querySelector(selectors.iconPause)
  const iconVolume = videoContainer.querySelector(selectors.iconVolume)
  const iconVolumeMute = videoContainer.querySelector(selectors.iconVolumeMute)

  video.controls = false
  setVolume(initVolume)

  video.addEventListener('click', () => {
    if (video.paused) {
      play()
    } else {
      pause()
    }
  })

  video.addEventListener('ended', () => {
    pause()
  })

  if (initPlay) {
    initPlay.addEventListener('click', () => {
      play()
      initPlay.classList.add(cssClasses.hidden)
      controls.classList.remove(cssClasses.hidden)
    })
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (video.paused) {
        play()
      } else {
        pause()
      }
    })
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      if (video.muted) {
        toggleMute(false)
      } else {
        toggleMute(true)
      }
    })
  }

  if (volumeBtn) {
    volumeBtn.value = initVolume
    volumeBtn.addEventListener('input', (e) => {
      setVolume(e.target.value)
    })
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (video.requestFullscreen) {
        video.requestFullscreen()
      } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen()
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen()
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen()
      }
    })
  }

  function play() {
    video.play()
    iconPlay.classList.toggle(cssClasses.hidden)
    iconPause.classList.toggle(cssClasses.hidden)
    videoContainer.classList.remove(cssClasses.paused)
  }

  function pause() {
    video.pause()
    iconPlay.classList.toggle(cssClasses.hidden)
    iconPause.classList.toggle(cssClasses.hidden)
    videoContainer.classList.add(cssClasses.paused)
  }

  function toggleMute(mute) {
    iconVolume.classList.toggle(cssClasses.hidden)
    iconVolumeMute.classList.toggle(cssClasses.hidden)

    if (mute) {
      video.muted = true
      volumeBtn.value = 0
    } else {
      video.muted = false
      volumeBtn.value = video.volume

      if (video.volume === 0) {
        video.volume = initVolume
        volumeBtn.value = initVolume
      }
    }
  }

  function setVolume(value) {
    video.volume = value
    if (value === '0') {
      toggleMute(true)
    } else if (video.muted) {
      toggleMute(false)
    }
  }
}

export const video = () => {
  const videoContainers = document.querySelectorAll(selectors.main)
  for (let i = 0; i < videoContainers.length; i++) {
    addVideoControls(videoContainers[i])
  }
}
