import { bootstrapMeshScene } from './util/standard-scene'
import { LDrawLoader } from 'three/examples/jsm/loaders/LDrawLoader'
import { visitChildren } from '../../util/modelUtil'

const loadModel = () => {
  const loader = new LDrawLoader()

  // return loader.loadAsync('/assets/models/lego/10174-1-ImperialAT-ST-UCS.mpd_Packed.mpd').then((model) => {
  return loader.loadAsync('/assets/models/lego/7140-1-X-wingFighter.mpd_Packed.mpd').then((model) => {
    model.scale.set(0.015, 0.015, 0.015)
    model.rotateZ(Math.PI)
    model.rotateY(Math.PI)

    model.translateY(1)

    visitChildren(model, (child) => {
      child.castShadow = true
      child.receiveShadow = true
    })

    return model
  })
}

bootstrapMeshScene({
  loadMesh: loadModel,
  floorSize: 20
}).then()
