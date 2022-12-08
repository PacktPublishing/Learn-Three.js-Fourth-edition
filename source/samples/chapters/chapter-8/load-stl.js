import { bootstrapMeshScene } from './util/standard-scene'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import * as THREE from 'three'

const modelAsync = () => {
  return new STLLoader().loadAsync('/assets/models/astronaut/astronaut.stl').then((model) => {
    const material = new THREE.MeshNormalMaterial()
    const mesh = new THREE.Mesh(model, material)
    mesh.castShadow = true
    mesh.scale.set(0.1, 0.1, 0.1)
    mesh.translateY(-1.5)
    mesh.translateZ(-1)
    mesh.translateX(-2)
    mesh.rotateX(-0.5 * Math.PI)

    return mesh
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync
}).then()
