import * as THREE from 'three'
import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'
import { getObjectsKeys } from '../../util'

const props = {
  radius: 1,
  detail: 0,
  geom: 'customGeometry'
}

const vertices = [1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1]
const indices = [2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1]

const geometries = {
  customGeometry: () => new THREE.PolyhedronBufferGeometry(vertices, indices, props.radius, props.detail),
  tetrahedronGeometry: () => new THREE.TetrahedronGeometry(props.radius, props.detail),
  octahedronGeometry: () => new THREE.OctahedronGeometry(props.radius, props.detail),
  icosahedronGeometry: () => new THREE.IcosahedronGeometry(props.radius, props.detail),
  dodecahedronGeometry: () => new THREE.DodecahedronGeometry(props.radius, props.detail)
}

const updateGeometry = ({ geom }) => geometries[geom]()

const geometry = updateGeometry({ geom: 'customGeometry' })

bootstrapGeometryScene({
  geometry,
  provideGui: (gui, mesh) => {
    const folder = gui.addFolder('THREE.PolyhedronGeometry')
    folder.add(props, 'geom', getObjectsKeys(geometries)).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'radius', 0, 10, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'detail', 0, 4, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
  }
}).then()
