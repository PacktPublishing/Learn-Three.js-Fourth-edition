import { bootstrapMeshScene } from './util/standard-scene'
import { VTKLoader } from 'three/examples/jsm/loaders/VTKLoader'
import { visitChildren } from '../../util/modelUtil'
import * as THREE from 'three'

const modelAsync = () => {
  return new VTKLoader().loadAsync('/assets/models/moai/moai_fixed.vtk').then((model) => {
    model.computeVertexNormals()
    const mesh = new THREE.Mesh(model, new THREE.MeshStandardMaterial({ color: 0x894931 }))
    mesh.scale.setScalar(5)
    mesh.castShadow = true
    mesh.receiveShadow = true

    return mesh
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync
}).then()
