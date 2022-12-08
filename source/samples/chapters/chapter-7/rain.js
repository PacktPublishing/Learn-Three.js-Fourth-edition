import { bootstrapGeometryScene } from './util/standard-scene'
import * as THREE from 'three'

const count = 25000
const range = 20
const createPoints = () => {
  const points = []
  for (let i = 0; i < count; i++) {
    let particle = new THREE.Vector3(
      Math.random() * range - range / 2,
      Math.random() * range - range / 2,
      Math.random() * range - range / 1.5
    )

    points.push(particle)
  }

  const velocityArray = new Float32Array(count * 2)
  for (let i = 0; i < count * 2; i += 2) {
    velocityArray[i] = ((Math.random() - 0.5) / 5) * 0.1
    velocityArray[i + 1] = (Math.random() / 5) * 0.1 + 0.01
  }

  const geom = new THREE.BufferGeometry().setFromPoints(points)
  geom.setAttribute('velocity', new THREE.BufferAttribute(velocityArray, 2))
  return geom
}

const texture = new THREE.TextureLoader().load('/assets/textures/particles/raindrop-3t.png')

bootstrapGeometryScene({
  backgroundColor: 0x000000,
  geometry: createPoints(),
  provideGui: () => {},
  material: new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: false,
    color: 0xffffff,
    map: texture,
    transparent: true,
    opacity: 0.8,
    alphaTest: 0.01
  }),
  hidefloor: true,
  onRender: (points) => {
    const positionArray = points.geometry.attributes.position.array
    const velocityArray = points.geometry.attributes.velocity.array

    for (let i = 0; i < points.geometry.attributes.position.count; i++) {
      const velocityX = velocityArray[i * 2]
      const velocityY = velocityArray[i * 2 + 1]

      positionArray[i * 3] += velocityX
      positionArray[i * 3 + 1] -= velocityY

      if (positionArray[i * 3] <= -(range / 2) || positionArray[i * 3] >= range / 2)
        positionArray[i * 3] = positionArray[i * 3] * -1
      if (positionArray[i * 3 + 1] <= -(range / 2) || positionArray[i * 3 + 1] >= range / 2)
        positionArray[i * 3 + 1] = positionArray[i * 3 + 1] * -1
    }
    points.geometry.attributes.position.needsUpdate = true
  }
}).then()
