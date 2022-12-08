import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeMeshNormalMaterial } from '../../controls/material-controls'

const props = {
  material: new THREE.MeshNormalMaterial(),
  withMaterialGui: true,
  provideGui: (gui, mesh, material, scene) => {
    initializeMeshNormalMaterial(gui, mesh, material, scene)
  }
}

bootstrapMaterialScene(props).then()
