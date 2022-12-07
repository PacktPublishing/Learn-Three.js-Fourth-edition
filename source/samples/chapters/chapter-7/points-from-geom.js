import { bootstrapGeometryScene } from './util/standard-scene'
import * as THREE from 'three'

const texture = new THREE.TextureLoader().load('/assets/textures/particles/glow.png')

bootstrapGeometryScene({
  backgroundColor: 0x000000,
  geometry: new THREE.TorusKnotGeometry(2, 0.5, 100, 30, 2, 3),
  material: new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: false,
    color: 0xffffff,
    map: texture,
    depthWrite: false,
    opacity: 0.1,
    transparent: true,
    blending: THREE.AdditiveBlending
  }),
  provideGui: (gui, point, scene) => {
    scene.backgroundColor = 0x000000
  },
  hidefloor: true,
  onRender: (points) => {
    const positionArray = points.geometry.attributes.position.array

    for (let i = 0; i < points.geometry.attributes.position.count; i++) {
      const velocityX = (Math.random() - 0.5) * 0.002
      const velocityY = (Math.random() - 0.5) * 0.002
      const velocityZ = (Math.random() - 0.5) * 0.002

      positionArray[i * 3] += velocityX
      positionArray[i * 3 + 1] += velocityY
      positionArray[i * 3 + 2] += velocityZ
    }
    points.geometry.attributes.position.needsUpdate = true
  }
}).then()
