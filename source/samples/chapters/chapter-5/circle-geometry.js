import * as THREE from 'three'
import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'

const circleProps = {
  radius: 2,
  segments: 32,
  thetaStart: 0,
  thetaLength: 2 * Math.PI
}

const updateGeometry = ({ radius, segments, thetaStart, thetaLength }) => {
  return new THREE.CircleGeometry(radius, segments, thetaStart, thetaLength)
}

const geometry = updateGeometry(circleProps)

const props = {
  geometry,
  provideGui: (gui, mesh) => {
    const folder = gui.addFolder('THREE.CircleGeometry')
    folder.add(circleProps, 'radius', 0, 10, 0.01).onChange(() => updateMesh(mesh, updateGeometry(circleProps)))
    folder.add(circleProps, 'segments', 0, 50, 1).onChange(() => updateMesh(mesh, updateGeometry(circleProps)))
    folder.add(circleProps, 'thetaStart', 0, 10, 0.01).onChange(() => updateMesh(mesh, updateGeometry(circleProps)))
    folder.add(circleProps, 'thetaLength', 0, 10, 0.01).onChange(() => updateMesh(mesh, updateGeometry(circleProps)))
  }
}

bootstrapGeometryScene(props).then()
