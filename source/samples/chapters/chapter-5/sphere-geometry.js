import * as THREE from 'three'
import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'

const props = {
  radius: 1,
  widthSegments: 30,
  heightSegments: 30,
  phiStart: 0,
  phiLength: Math.PI * 2,
  thetaStart: 0,
  thetaLength: Math.PI
}

const updateGeometry = ({ radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength }) => {
  return new THREE.SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
}

const geometry = updateGeometry(props)

bootstrapGeometryScene({
  geometry,
  provideGui: (gui, mesh) => {
    const folder = gui.addFolder('THREE.SphereGeometry')
    folder.add(props, 'radius', 0, 10, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'widthSegments', 1, 100, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'heightSegments', 1, 100, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'phiStart', 0, 2 * Math.PI, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'phiLength', 0, 2 * Math.PI, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'thetaStart', 0, Math.PI, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'thetaLength', 0, Math.PI, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
  }
}).then()
