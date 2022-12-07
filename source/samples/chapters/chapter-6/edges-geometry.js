import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry'

const props = {
  thresholdAngle: 1
}

// const baseGeometry = new THREE.TorusKnotBufferGeometry(3, 1, 100, 20, 6, 9)
// const baseGeometry = new THREE.BoxGeometry(3, 3, 3)
const baseGeometry = new RoundedBoxGeometry(3, 3, 3, 10, 0.4)

const updateGeometry = ({ thresholdAngle }) => {
  return new THREE.EdgesGeometry(baseGeometry, thresholdAngle)
}

const geometry = updateGeometry(props)

bootstrapGeometryScene({
  geometry,
  provideGui: (gui, mesh) => {
    const folder = gui.addFolder('THREE.EdgesGeometry')
    folder.add(props, 'thresholdAngle', 0, 3, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
  },
  overrideMaterial: new THREE.LineBasicMaterial({ color: 0x000000 }),
  useLine: true
}).then()
