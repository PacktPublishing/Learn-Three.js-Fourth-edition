import { bootstrapMeshScene } from './util/standard-scene'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'
import * as THREE from 'three'

const texture = new THREE.TextureLoader().load('/assets/textures/particles/glow.png')
const material = new THREE.PointsMaterial({
  size: 0.15,
  vertexColors: false,
  color: 0xffffff,
  map: texture,
  depthWrite: false,
  opacity: 0.1,
  transparent: true,
  blending: THREE.AdditiveBlending
})

const modelAsync = () => {
  return new PLYLoader().loadAsync('/assets/models/carcloud/carcloud.ply').then((model) => {
    const points = new THREE.Points(model, material)
    points.scale.set(0.7, 0.7, 0.7)
    return points
  })
}

bootstrapMeshScene({
  backgroundColor: 0x0000,
  loadMesh: modelAsync,
  hidefloor: true
}).then()
