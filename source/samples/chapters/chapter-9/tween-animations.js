import { bootstrapMeshScene } from './util/standard-scene'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as TWEEN from 'tween.js'

const texture = new THREE.TextureLoader().load('/assets/textures/particles/glow.png')

const modelAsync = () => {
  const geometry = new THREE.TorusKnotGeometry(2, 0.5, 150, 50, 3, 4)
  geometry.setAttribute('originalPos', geometry.attributes['position'].clone())

  const material = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: false,
    color: 0xffffff,
    map: texture,
    depthWrite: false,
    opacity: 0.1,
    transparent: true,
    blending: THREE.AdditiveBlending
  })
  const mesh = new THREE.Points(geometry, material)

  const tweenData = {
    pos: 1
  }
  new TWEEN.Tween(tweenData).to({ pos: 0 }, 5000).yoyo(true).repeat(Infinity).easing(TWEEN.Easing.Bounce.InOut).start()

  mesh.name = 'PointsMesh'
  mesh.userData.tweenData = tweenData

  return mesh
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  backgroundColor: 0x000000,
  hidefloor: true,
  addControls: (camera, renderer, scene, gui) => {
    const orbit = new OrbitControls(camera, renderer.domElement)
    orbit.update()
  },
  onRender: (clock, controls, camera, scene) => {
    const points = scene.getObjectByName('PointsMesh')
    const originalPosArray = points.geometry.attributes.originalPos.array
    const positionArray = points.geometry.attributes.position.array
    TWEEN.update()

    // the points.userData.tweenData now contains the correct
    // value.
    for (let i = 0; i < points.geometry.attributes.position.count; i++) {
      positionArray[i * 3] = originalPosArray[i * 3] * points.userData.tweenData.pos
      positionArray[i * 3 + 1] = originalPosArray[i * 3 + 1] * points.userData.tweenData.pos
      positionArray[i * 3 + 2] = originalPosArray[i * 3 + 2] * points.userData.tweenData.pos
    }
    points.geometry.attributes.position.needsUpdate = true
  }
}).then()
