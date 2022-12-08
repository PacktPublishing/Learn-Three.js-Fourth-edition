import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry'
import * as THREE from 'three'

const props = {
  width: 6,
  height: 6,
  depth: 6,
  widthSegments: 10,
  heightSegments: 10,
  depthSegments: 10
}

const updateGeometry = ({ width, height, depth, widthSegments, heightSegments, depthSegments }) => {
  return new BoxLineGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
}

const geometry = updateGeometry(props)

bootstrapGeometryScene({
  geometry,
  provideGui: (gui, mesh) => {
    const folder = gui.addFolder('THREE.BoxLineGeometry')
    folder.add(props, 'width', 0, 10, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'height', 0, 10, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'depth', 0, 10, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'widthSegments', 1, 20, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'heightSegments', 1, 20, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'depthSegments', 1, 20, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
  },
  overrideMaterial: new THREE.LineBasicMaterial({ color: 0x000000 }),
  useLine: true
}).then()
