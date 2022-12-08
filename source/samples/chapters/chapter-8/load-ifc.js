import { bootstrapMeshScene } from './util/standard-scene'
import { IFCLoader } from 'three/examples/jsm/loaders/IFCLoader'
import { visitChildren } from '../../util/modelUtil'

const modelAsync = () => {
  const loader = new IFCLoader()
  loader.ifcManager.setWasmPath('../assets/models/ifc/')

  return loader.loadAsync('/assets/models/ifc/schependomlaan.ifc').then((model) => {
    model.scale.set(0.5, 0.5, 0.5)
    model.translateX(-5)
    model.translateY(-1.4)
    visitChildren(model, (child) => {
      child.receiveShadow = true
      child.castShadow = true
    })
    return model
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  floorSize: 200
}).then()
