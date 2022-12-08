import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeGuiMeshPhysicalMaterial } from '../../controls/material-controls'

// TODO: Check the lights and shadows for the basic scene and do some tuning for
// the shadows.

const props = {
  material: new THREE.MeshPhysicalMaterial({ color: 0x777777 }),
  withMaterialGui: true,
  provideGui: (gui, mesh, material) => {
    initializeGuiMeshPhysicalMaterial(gui, mesh, material)
  }
}

bootstrapMaterialScene(props).then()
