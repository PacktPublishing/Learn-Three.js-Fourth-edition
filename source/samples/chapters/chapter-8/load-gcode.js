import { bootstrapMeshScene } from './util/standard-scene'
import { GCodeLoader } from 'three/examples/jsm/loaders/GCodeLoader'
import { visitChildren } from '../../util/modelUtil'
import * as THREE from 'three'

const modelAsync = () => {
  const loader = new GCodeLoader()

  return loader.loadAsync('/assets/models/benchy/benchy.gcode').then((model) => {
    model.translateZ(-1)
    model.translateX(-14)
    model.translateY(-16)

    model.scale.set(0.15, 0.15, 0.15)

    visitChildren(model, (child) => {
      child.receiveShadow = true
      child.castShadow = true
      child.geometry.computeVertexNormals()
      child.material.color = new THREE.Color(0x000000)
      child.material.wireframe = true
    })

    return model
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync
}).then()
