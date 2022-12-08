import { bootstrapGeometryScene } from './util/standard-scene'
import * as THREE from 'three'

const props = {}

const baseGeometry = new THREE.TorusKnotBufferGeometry(3, 1, 100, 20, 6, 9)

const updateGeometry = () => {
  return new THREE.WireframeGeometry(baseGeometry)
}

const geometry = updateGeometry(props)

bootstrapGeometryScene({
  geometry,
  provideGui: () => {},
  overrideMaterial: new THREE.LineBasicMaterial({ color: 0x000000 }),
  useLine: true
}).then()
