// Use sprites and sprite material for a simple rendering
import { bootstrapGeometryScene } from './util/standard-scene'
import * as THREE from 'three'
import { createGhostTexture } from './util/sprite-util'

const createPoints = () => {
  const points = []
  const range = 15
  for (let i = 0; i < 1000000; i++) {
    let particle = new THREE.Vector3(
      Math.random() * range - range / 2,
      Math.random() * range - range / 2,
      Math.random() * range - range / 2
    )

    points.push(particle)
  }

  const colors = new Float32Array(points.length * 3)
  points.forEach((e, i) => {
    const c = new THREE.Color(Math.random() * 0xffffff)
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  })

  const geom = new THREE.BufferGeometry().setFromPoints(points)
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3, true))

  return geom
}

bootstrapGeometryScene({
  geometry: createPoints(),
  provideGui: () => {},
  material: new THREE.PointsMaterial({ size: 0.1, vertexColors: true, color: 0xffffff, map: createGhostTexture() }),
  hidefloor: true
}).then()
