import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeGuiLineDashedMaterial } from '../../controls/material-controls'

const props = {
  material: new THREE.LineDashedMaterial({
    color: 0x777777,
    linewidth: 1,
    scale: 1,
    dashSize: 1,
    gapSize: 1
  }),
  withMaterialGui: true,
  provideGui: (gui, mesh, material) => {
    initializeGuiLineDashedMaterial(gui, mesh, material)
  }
}

bootstrapMaterialScene(props).then()
