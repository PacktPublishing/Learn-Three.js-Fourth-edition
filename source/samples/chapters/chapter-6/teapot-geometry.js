import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry'

const props = {
  size: 1,
  segments: 20,
  bottom: true,
  lid: true,
  body: true,
  fitLid: true,
  blinn: true // aspects
}

const updateGeometry = ({ size, segments, bottom, lid, body, fitLid, blinn }) => {
  return new TeapotGeometry(size, segments, bottom, lid, body, fitLid, blinn)
}

const geometry = updateGeometry(props)

bootstrapGeometryScene({
  geometry,
  provideGui: (gui, mesh) => {
    const folder = gui.addFolder('THREE.TeapotGeometry')
    folder.add(props, 'size', 0, 10, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'segments', 1, 30, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'bottom', 0, 10, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'lid', 1, 20, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'body', 0, 3, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'fitLid', 0, 3, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'blinn', 0, 3, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
  }
}).then()
