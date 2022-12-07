import { bootstrapMeshScene } from './util/standard-scene'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { visitChildren } from '../../util/modelUtil'

const modelAsync = () => {
  return new OBJLoader().loadAsync('/assets/models/baymax/Bigmax_White_OBJ.obj').then((model) => {
    model.scale.set(0.05, 0.05, 0.05)
    model.translateY(-1)

    visitChildren(model, (child) => {
      child.receiveShadow = true
      child.castShadow = true
    })

    return model
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync
}).then()
