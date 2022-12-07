import * as THREE from 'three'
import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'

const props = {
  radius: 1,
  height: 3,
  radialSegments: 30,
  heightSegments: 30,
  openEnded: true,
  thetaStart: 0,
  thetaLength: 2 * Math.PI
}

const updateGeometry = ({ radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength }) => {
  return new THREE.ConeGeometry(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
}

const geometry = updateGeometry(props)

bootstrapGeometryScene({
  geometry,
  provideGui: (gui, mesh) => {
    const folder = gui.addFolder('THREE.ConeGeometry')
    folder.add(props, 'radius', -10, 10, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'height', 0, 10, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'radialSegments', 1, 100, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'heightSegments', 1, 100, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'openEnded').onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'thetaStart', 0, Math.PI, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'thetaLength', 0, 2 * Math.PI, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
  }
}).then()
