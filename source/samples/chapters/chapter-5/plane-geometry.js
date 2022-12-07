import * as THREE from 'three'
import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'

const planeProps = {
  width: 2,
  height: 2,
  widthSegments: 10,
  heightSegments: 20
}

const updateGeometry = ({ width, height, widthSegments, heightSegments }) => {
  return new THREE.PlaneGeometry(width, height, widthSegments, heightSegments)
}

const geometry = updateGeometry(planeProps)

const props = {
  geometry,
  provideGui: (gui, mesh) => {
    const folder = gui.addFolder('THREE.PlaneGeometry')
    folder.add(planeProps, 'width', 0, 10, 0.01).onChange(() => updateMesh(mesh, updateGeometry(planeProps)))
    folder.add(planeProps, 'height', 0, 10, 0.01).onChange(() => updateMesh(mesh, updateGeometry(planeProps)))
    folder.add(planeProps, 'widthSegments', 0, 50, 1).onChange(() => updateMesh(mesh, updateGeometry(planeProps)))
    folder.add(planeProps, 'heightSegments', 0, 50, 1).onChange(() => updateMesh(mesh, updateGeometry(planeProps)))
  }
}

bootstrapGeometryScene(props).then()
