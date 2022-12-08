import { bootstrapMeshScene } from './util/standard-scene'
import { VOXLoader } from 'three/examples/jsm/loaders/VOXLoader'
import { VOXMesh } from 'three/examples/jsm/loaders/VOXLoader'
import * as THREE from 'three'

const loadModel = () => {
  return new VOXLoader().loadAsync('/assets/models/vox/biome.vox').then((chunks) => {
    // return new VOXLoader().loadAsync('/assets/models/vox/monu9.vox').then((chunks) => {
    const group = new THREE.Group()
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      const mesh = new VOXMesh(chunk)
      mesh.castShadow = true
      mesh.receiveShadow = true
      group.add(mesh)
    }

    group.scale.setScalar(0.1)
    return group
  })
}

bootstrapMeshScene({
  loadMesh: loadModel,
  hidefloor: true
}).then()
