import { bootstrapMeshScene } from './util/standard-scene'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import { visitChildren } from '../../util/modelUtil'

const modelAsync = () => {
  const loader = new GLTFLoader()
  return loader.loadAsync('/assets/models/sea_house/scene.gltf').then((structure) => {
    structure.scene.scale.setScalar(0.2, 0.2, 0.2)
    visitChildren(structure.scene, (child) => {
      if (child.material) {
        child.material.depthWrite = true
      }
    })
    return structure.scene
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  hidefloor: true
}).then()
