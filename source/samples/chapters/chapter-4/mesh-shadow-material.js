import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'

const props = {
  material: new THREE.ShadowMaterial({ color: 0x777777 }),
  withMaterialGui: true,
  provideGui: () => {}
}

bootstrapMaterialScene(props).then()
