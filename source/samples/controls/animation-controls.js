import * as THREE from 'three'

export const initializeAnimationControls = (mixer, action, clip, gui) => {
  const props = {
    repetitions: Infinity,
    // warp
    warpStartTimeScale: 1,
    warpEndTimeScale: 1,
    warpDurationInSeconds: 2,
    warp: function () {
      action.warp(props.warpStartTimeScale, props.warpEndTimeScale, props.warpDurationInSeconds)
    },
    fadeDurationInSeconds: 2,
    fadeIn: function () {
      action.fadeIn(props.fadeDurationInSeconds)
    },
    fadeOut: function () {
      action.fadeOut(props.fadeDurationInSeconds)
    }
  }

  const mixerFolder = gui.addFolder('AnimationMixer')
  mixerFolder.add(mixer, 'time').listen()
  mixerFolder.add(mixer, 'timeScale', 0, 5)
  mixerFolder.add(mixer, 'stopAllAction')

  const actionFolder = gui.addFolder('AnimationAction')

  actionFolder.add(action, 'clampWhenFinished').listen()
  actionFolder.add(action, 'enabled').listen()
  actionFolder.add(action, 'paused').listen()
  actionFolder
    .add(action, 'loop', {
      LoopRepeat: THREE.LoopRepeat,
      LoopOnce: THREE.LoopOnce,
      LoopPingPong: THREE.LoopPingPong
    })
    .onChange((e) => {
      if (e == THREE.LoopOnce || e == THREE.LoopPingPong) {
        action.reset()
        action.repetitions = undefined
        action.setLoop(parseInt(e), undefined)
      } else {
        action.setLoop(parseInt(e), action.repetitions)
      }
    })
  actionFolder
    .add(action, 'repetitions', 0, 100, 1)
    .listen()
    .onChange(function (e) {
      if (action.loop == THREE.LoopOnce || action.loop == THREE.LoopPingPong) {
        action.reset()
        action.repetitions = undefined
        action.setLoop(parseInt(action.loop), undefined)
      } else {
        action.setLoop(parseInt(e), action.repetitions)
      }
    })
  actionFolder.add(action, 'time', 0, clip.duration, 0.001).listen()
  actionFolder.add(action, 'timeScale', 0, 5, 0.1).listen()
  actionFolder.add(action, 'weight', 0, 1, 0.01).listen()
  actionFolder.add(action, 'zeroSlopeAtEnd').listen()
  actionFolder.add(action, 'zeroSlopeAtStart').listen()
  actionFolder.add(action, 'stop')
  actionFolder.add(action, 'play')
  actionFolder.add(action, 'reset')
  actionFolder.add(props, 'warpStartTimeScale', 0, 10, 0.01)
  actionFolder.add(props, 'warpEndTimeScale', 0, 10, 0.01)
  actionFolder.add(props, 'warpDurationInSeconds', 0, 10, 0.01)
  actionFolder.add(props, 'warp')
  actionFolder.add(props, 'fadeDurationInSeconds', 0, 10, 0.01)
  actionFolder.add(props, 'fadeIn')
  actionFolder.add(props, 'fadeOut')

  return {
    actionFolder,
    mixerFolder
  }
}
