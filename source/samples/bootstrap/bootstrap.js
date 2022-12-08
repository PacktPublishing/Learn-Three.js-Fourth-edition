import * as THREE from 'three'
import { initOrbitControls } from '../controller/orbit-controller'
import { initLighting } from './lighting'
import { onResize } from '../util/update-on-resize'

export const initScene = ({ backgroundColor, fogColor, disableShadows, disableLights, disableDefaultControls }) => {
  const init = (fn) => {
    // basic scene setup
    const scene = new THREE.Scene()
    if (backgroundColor) {
      scene.backgroundColor = backgroundColor
    }

    if (fogColor) {
      scene.fog = new THREE.Fog(fogColor, 0.0025, 50)
    }

    // setup camera and basic renderer
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.VSMShadowMap
    renderer.setClearColor(backgroundColor)

    onResize(camera, renderer)
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    // initialize orbit controls
    let orbitControls
    if (!disableDefaultControls) {
      orbitControls = initOrbitControls(camera, renderer)
    }

    // add some basic lighting to the scene
    if (!disableLights ?? false) {
      initLighting(scene, { disableShadows })
    }

    fn({ scene, camera, renderer, orbitControls })
  }

  return init
}
