import * as THREE from 'three'
import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'

const props = {
  innerRadius: 2,
  outerRadius: 3,
  thetaSegments: 20,
  phiSegments: 5,
  thetaStart: 0,
  thetaLength: Math.PI * 2
}

const updateGeometry = ({ innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength }) => {
  return new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength)
}

const geometry = updateGeometry(props)

bootstrapGeometryScene({
  geometry,
  provideGui: (gui, mesh) => {
    const folder = gui.addFolder('THREE.RingGeometry')
    folder.add(props, 'innerRadius', 0, 10, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'outerRadius', 0, 10, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'thetaSegments', 0, 50, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'phiSegments', 0, 50, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'thetaStart', 0, 2 * Math.PI, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'thetaLength', 0, 2 * Math.PI, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
  }
}).then()
