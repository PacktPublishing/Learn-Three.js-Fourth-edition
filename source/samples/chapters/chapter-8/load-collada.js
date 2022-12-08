import { bootstrapMeshScene } from './util/standard-scene'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader'
import { visitChildren } from '../../util/modelUtil'

const loadModel = (scene) => {
  const loader = new ColladaLoader()
  return loader.loadAsync('/assets/models/stormtrooper/stormtrooper.dae').then((container) => {
    container.scene.translateZ(-2)
    container.scene.rotateZ(Math.PI)
    visitChildren(container.scene, (child) => {
      child.castShadow = true
    })
    return container.scene
  })
}

bootstrapMeshScene({
  loadMesh: loadModel
}).then()
