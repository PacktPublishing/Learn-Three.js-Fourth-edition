// Use sprites and sprite material for a simple rendering
import { bootstrapGeometryScene } from './util/standard-scene'
import * as THREE from 'three'

const createPoints = () => {
  const points = []

  for (let x = -15; x < 15; x++) {
    for (let y = -10; y < 10; y++) {
      let point = new THREE.Vector3(x / 4, y / 4, 0)
      points.push(point)
    }
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
  material: new THREE.PointsMaterial({ size: 0.1, vertexColors: true, color: 0xffffff }),
  hidefloor: true
}).then()
