import { bootstrapMeshScene } from './util/standard-scene'
import { XYZLoader } from 'three/examples/jsm/loaders/XYZLoader'
import * as THREE from 'three'

const texture = new THREE.TextureLoader().load('/assets/textures/particles/glow.png')
const material = new THREE.PointsMaterial({
  size: 0.3,
  vertexColors: false,
  color: 0xffffff,
  map: texture,
  depthWrite: false,
  opacity: 0.3,
  transparent: true,
  blending: THREE.AdditiveBlending
})

const loadModel = () => {
  return new XYZLoader().loadAsync('/assets/models/xyz/crystal_4000.xyz').then((model) => {
    const points = new THREE.Points(model, material)
    points.scale.setScalar(0.2)
    points.translateX(-4)
    points.translateY(-2)
    points.translateZ(-2)
    return points
  })
}

bootstrapMeshScene({
  backgroundColor: 0x00000,
  loadMesh: loadModel,
  hidefloor: true
}).then()
