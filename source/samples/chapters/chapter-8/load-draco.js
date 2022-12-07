import { bootstrapMeshScene } from './util/standard-scene'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import * as THREE from 'three'

const modelAsync = () => {
  const loader = new DRACOLoader()
  loader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.1/')
  loader.setDecoderConfig({ type: 'js' })

  return loader.loadAsync('/assets/models/bunny/bunny.drc').then((geom) => {
    geom.computeVertexNormals()
    const mesh = new THREE.Mesh(geom, new THREE.MeshNormalMaterial())
    mesh.scale.set(30, 30, 30)
    mesh.translateY(-3)
    mesh.translateZ(-1)
    mesh.castShadow = true
    return mesh
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync
}).then()
