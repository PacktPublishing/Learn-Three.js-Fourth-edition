import { bootstrapMeshScene } from './util/standard-scene'
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader'
import * as THREE from 'three'
import { visitChildren } from '../../util/modelUtil'

const loadModel = () => {
  return new TDSLoader().loadAsync('/assets/models/chair/Eames_chair_DSW.3DS').then((model) => {
    console.log(model)
    model.scale.set(0.05, 0.05, 0.05)
    visitChildren(model, (child) => {
      child.castShadow = true
    })
    model.translateY(-2)
    model.rotateX(-0.5 * Math.PI)
    return model
  })
}

bootstrapMeshScene({
  loadMesh: loadModel
}).then()
