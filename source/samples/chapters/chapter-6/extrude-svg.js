import * as THREE from 'three'
import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'

const props = {
  amount: 20,
  curveSegments: 12,
  steps: 100,
  depth: true,
  bevelEnabled: false,
  bevelThickness: 0,
  bevelSize: 0,
  bevelOffset: 0,
  bevelSegments: 10
}

const p = new SVGLoader().loadAsync('/assets/svg/batman.svg')
let shapes = {}

const updateGeometry = ({
  curveSegments,
  steps,
  depth,
  bevelEnabled,
  bevelThickness,
  bevelSize,
  bevelOffset,
  bevelSegments,
  amount
}) => {
  return new THREE.ExtrudeGeometry(shapes, {
    curveSegments,
    steps,
    depth,
    bevelEnabled,
    bevelThickness,
    bevelSize,
    bevelOffset,
    bevelSegments,
    amount
  })
    .scale(0.01, 0.01, 0.01)
    .translate(-3, -4, 0)
    .rotateX(Math.PI)
}

p.then((svg) => {
  shapes = SVGLoader.createShapes(svg.paths[0])
  bootstrapGeometryScene({
    geometry: updateGeometry(props),
    provideGui: (gui, mesh) => {
      const folder = gui.addFolder('THREE.ExtrudeGeometry')
      folder.add(props, 'curveSegments', 1, 30, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
      folder.add(props, 'amount', 1, 400, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
      folder.add(props, 'steps', 10, 300, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
      folder.add(props, 'depth').onChange(() => updateMesh(mesh, updateGeometry(props)))
      folder.add(props, 'bevelEnabled').onChange(() => updateMesh(mesh, updateGeometry(props)))
      folder.add(props, 'bevelThickness', 0, 1, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
      folder.add(props, 'bevelSize', 0, 3, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
      folder.add(props, 'bevelOffset', 0, 3, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
      folder.add(props, 'bevelSegments', 1, 30, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
    }
  })
}).then()
