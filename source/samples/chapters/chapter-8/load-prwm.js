import { bootstrapMeshScene } from './util/standard-scene'
import { PRWMLoader } from 'three/examples/jsm/loaders/PRWMLoader'
import * as THREE from 'three'

const loadModel = () => {
  return new PRWMLoader().loadAsync('/assets/models/cerberus/cerberus.be.prwm').then((model) => {
    const material = new THREE.MeshNormalMaterial()
    const mesh = new THREE.Mesh(model, material)
    mesh.castShadow = true
    mesh.scale.set(4, 4, 4)
    return mesh
  })
}

bootstrapMeshScene({
  loadMesh: loadModel
}).then()
