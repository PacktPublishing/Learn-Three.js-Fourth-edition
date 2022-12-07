import { bootstrapMeshScene } from './util/standard-scene'
import { VRMLLoader } from 'three/examples/jsm/loaders/VRMLLoader'
import { visitChildren } from '../../util/modelUtil'

const loadModel = () => {
  return new VRMLLoader().loadAsync('/assets/models/tree/tree.wrl').then((model) => {
    model.scale.setScalar(3)
    visitChildren(model, (child) => {
      child.castShadow = true
      child.receiveShadow = true
    })
    return model
  })
}

bootstrapMeshScene({
  loadMesh: loadModel
}).then()
