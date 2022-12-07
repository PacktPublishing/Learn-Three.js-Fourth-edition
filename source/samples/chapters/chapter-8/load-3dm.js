import { bootstrapMeshScene } from './util/standard-scene'
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader'
import { visitChildren } from '../../util/modelUtil'
import * as THREE from 'three'

const modelAsync = () => {
  const loader = new Rhino3dmLoader()
  loader.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/')

  return loader.loadAsync('/assets/models/ducky/Rubber_Duck.3dm').then((model) => {
    model.scale.set(0.2, 0.2, 0.2)
    model.rotateX(-0.5 * Math.PI)

    console.log(model)

    visitChildren(model, (child) => {
      child.receiveShadow = true
      child.castShadow = true
      child.material.color = new THREE.Color(0xf4fa00)
    })

    return model
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync
}).then()
