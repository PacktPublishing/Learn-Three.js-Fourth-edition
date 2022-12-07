import { bootstrapMeshScene } from './util/standard-scene'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import * as THREE from 'three'
import { WebGLProperties } from 'three'

const loader = new SVGLoader()
const modelAsync = () => {
  return loader.loadAsync('/assets/models/muffin/muffin-svgrepo-com.svg').then((model) => {
    const paths = model.paths
    const group = new THREE.Group()

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i]

      const material = new THREE.MeshBasicMaterial({
        color: path.color,
        side: THREE.DoubleSide,
        depthTest: false
      })

      const shapes = SVGLoader.createShapes(path)

      for (let j = 0; j < shapes.length; j++) {
        const shape = shapes[j]
        const geometry = new THREE.ShapeGeometry(shape)
        const mesh = new THREE.Mesh(geometry, material)
        group.add(mesh)
      }
    }

    group.translateX(1)
    group.translateY(4)
    group.translateZ(1)
    group.rotateZ(Math.PI)
    group.scale.set(0.05, 0.05, 0.05)

    return group
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  hidefloor: true
}).then()
