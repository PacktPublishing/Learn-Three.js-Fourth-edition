import { bootstrapMeshScene } from './util/standard-scene'
import { TiltLoader } from 'three/examples/jsm/loaders/TiltLoader'
import { visitChildren } from '../../util/modelUtil'

const loadModel = () => {
  return new TiltLoader().loadAsync('/assets/models/tilt/BRUSH_DOME.tilt').then((model) => {
    model.scale.set(0.1, 0.1, 0.1)
    model.translateY(-3)
    visitChildren(model, (child) => {
      child.castShadow = true
    })
    return model
  })
}

bootstrapMeshScene({
  loadMesh: loadModel
}).then()
