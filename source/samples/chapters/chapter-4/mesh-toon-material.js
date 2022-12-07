import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeGuiMeshToonMaterial } from '../../controls/material-controls'

const props = {
  material: new THREE.MeshToonMaterial({ color: 0x777777 }),
  withMaterialGui: true,
  provideGui: (gui, mesh, material) => {
    initializeGuiMeshToonMaterial(gui, mesh, material)
  }
}

bootstrapMaterialScene(props).then()
