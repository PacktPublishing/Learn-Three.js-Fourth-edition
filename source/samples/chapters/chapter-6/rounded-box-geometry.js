import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry'

const props = {
  width: 6,
  height: 6,
  depth: 6,
  segments: 10,
  radius: 1
}

const updateGeometry = ({ width, height, depth, segments, radius }) => {
  return new RoundedBoxGeometry(width, height, depth, segments, radius)
}

const geometry = updateGeometry(props)

bootstrapGeometryScene({
  geometry,
  provideGui: (gui, mesh) => {
    const folder = gui.addFolder('THREE.RoundedBoxGeometry')
    folder.add(props, 'width', 0, 10, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'height', 0, 10, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'depth', 0, 10, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'segments', 1, 20, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'radius', 0, 3, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
  }
}).then()
