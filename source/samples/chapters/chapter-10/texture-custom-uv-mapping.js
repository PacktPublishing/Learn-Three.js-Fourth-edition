import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeGuiMeshPhongMaterial } from '../../controls/material-controls'

const props = {
  material: new THREE.MeshPhongMaterial({ color: 0x777777 }),
  withMaterialGui: true,
  provideGui: (gui, mesh, material) => {
    initializeGuiMeshPhongMaterial(gui, mesh, material)
  }
}

bootstrapMaterialScene(props).then()
