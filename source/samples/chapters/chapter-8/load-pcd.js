import { bootstrapMeshScene } from './util/standard-scene'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader'

const modelAsync = () => {
  return new PCDLoader().loadAsync('/assets/models/points/car6.pcd').then((model) => {
    model.translateY(66)
    model.translateX(37)
    model.translateZ(6)

    model.material.size = 0.03

    return model
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync
}).then()
