import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeGuiMeshBasicMaterial } from '../../controls/material-controls'

const props = {
  material: new THREE.MeshBasicMaterial({ color: 0x777777 }),
  withMaterialGui: true,
  provideGui: (gui, mesh, material) => {
    initializeGuiMeshBasicMaterial(gui, mesh, material)
  }
}

bootstrapMaterialScene(props).then()
