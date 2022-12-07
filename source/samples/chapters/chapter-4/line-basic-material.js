import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeGuiLineBasicMaterial } from '../../controls/material-controls'

const props = {
  material: new THREE.LineBasicMaterial({
    color: 0x777777
  }),
  withMaterialGui: true,
  provideGui: (gui, mesh, material) => {
    initializeGuiLineBasicMaterial(gui, mesh, material)
  }
}

bootstrapMaterialScene(props).then()
