import { bootstrapGeometryScene } from './util/standard-scene'
import * as THREE from 'three'

const count = 7500
const range = 20
const createPoints = () => {
  const points = []
  for (let i = 0; i < count; i++) {
    let particle = new THREE.Vector3(
      Math.random() * range - range / 2,
      Math.random() * range - range / 2,
      Math.random() * range - range / 2
    )

    points.push(particle)
  }

  const velocityArray = new Float32Array(count * 2)
  for (let i = 0; i < count * 2; i += 2) {
    velocityArray[i] = ((Math.random() - 0.5) / 5) * 0.1
    velocityArray[i + 1] = (Math.random() / 5) * 0.1
  }

  const geom = new THREE.BufferGeometry().setFromPoints(points)
  geom.setAttribute('velocity', new THREE.BufferAttribute(velocityArray, 2))
  return geom
}

const texture1 = new THREE.TextureLoader().load('/assets/textures/particles/snowflake4_t.png')
const texture2 = new THREE.TextureLoader().load('/assets/textures/particles/snowflake2_t.png')
const texture3 = new THREE.TextureLoader().load('/assets/textures/particles/snowflake3_t.png')

const baseProps = {
  size: 0.1,
  color: 0xffffff,
  transparent: true,
  opacity: 0.5,
  blending: THREE.AdditiveBlending,
  depthTest: false,
  alphaTest: 0.01
}

const material1 = new THREE.PointsMaterial({
  ...baseProps,
  map: texture1
})
const material2 = new THREE.PointsMaterial({
  ...baseProps,
  map: texture2
})
const material3 = new THREE.PointsMaterial({
  ...baseProps,
  map: texture3
})

bootstrapGeometryScene({
  provideMesh: () => {
    const group = new THREE.Group()
    group.add(new THREE.Points(createPoints(), material1))
    group.add(new THREE.Points(createPoints(), material2))
    group.add(new THREE.Points(createPoints(), material3))
    return group
  },
  provideGui: () => {},
  backgroundColor: 0x000000,
  hidefloor: true,
  onRender: (pointsGroup) => {
    pointsGroup.children.forEach((points) => {
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
    })
  }
}).then()
