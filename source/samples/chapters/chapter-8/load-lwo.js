import { bootstrapMeshScene } from './util/standard-scene'
import { LWOLoader } from 'three/examples/jsm/loaders/LWOLoader'

const loadModel = () => {
  const loader = new LWOLoader()

  return loader.loadAsync('/assets/models/lwodemo/Demo.lwo').then((model) => {
    const meshToAdd = model.meshes[2]
    meshToAdd.scale.set(0.2, 0.2, 0.2)
    meshToAdd.castShadow = true
    return meshToAdd
  })
}

bootstrapMeshScene({
  loadMesh: loadModel
}).then()
