import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry'
import { ParametricGeometries } from 'three/examples/jsm/geometries/ParametricGeometries'
import * as THREE from 'three'
import { getObjectsKeys } from '../../util'

const plane = (width, height) => {
  return (u, v, optionalTarget) => {
    var result = optionalTarget || new THREE.Vector3()
    var x = u * width
    var y = 0
    var z = v * height
    return result.set(x, y, z)
  }
}

const radialWave = (u, v, optionalTarget) => {
  var result = optionalTarget || new THREE.Vector3()
  var r = 20

  var x = Math.sin(u) * r
  var z = Math.sin(v / 2) * 2 * r + -10
  var y = Math.sin(u * 4 * Math.PI) + Math.cos(v * 2 * Math.PI)

  return result.set(x, y, z)
}

const funcs = {
  plane: plane(10, 10),
  radialWave: radialWave,
  klein: ParametricGeometries.klein,
  mobius: ParametricGeometries.mobius,
  mobius3d: ParametricGeometries.mobius3d
}

const props = {
  slices: 20,
  stacks: 20,
  func: 'plane'
}

const updateGeometry = ({ func, slices, stacks }) => {
  return new ParametricGeometry(funcs[func], slices, stacks).scale(0.5, 0.5, 0.5).translate(-3, 0, 0)
}

const geometry = updateGeometry(props)

bootstrapGeometryScene({
  geometry,
  provideGui: (gui, mesh) => {
    mesh.material.side = THREE.DoubleSide
    const folder = gui.addFolder('THREE.ParametricGeometry')
    folder.add(props, 'slices', 1, 100, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'stacks', 1, 100, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'func', getObjectsKeys(funcs)).onChange(() => updateMesh(mesh, updateGeometry(props)))
  }
}).then()
