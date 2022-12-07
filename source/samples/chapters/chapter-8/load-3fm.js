import { bootstrapMeshScene } from './util/standard-scene'
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader'
import { visitChildren } from '../../util/modelUtil'
import * as THREE from 'three'

const modelAsync = () => {
  const loader = new ThreeMFLoader()

  return loader.loadAsync('/assets/models/gears/dodeca_chain_loop.3mf').then((model) => {
    model.scale.set(0.02, 0.02, 0.02)
    model.translateY(-1.5)
    model.translateX(-2)

    visitChildren(model, (child) => {
      child.receiveShadow = true
      child.castShadow = true
      child.material.color = new THREE.Color(0xeeffaa)
    })

    return model
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync
}).then()
