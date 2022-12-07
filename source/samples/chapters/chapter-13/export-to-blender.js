// 1. pick one of the simple scenes from one of the previous chapters. Probably one of the parametric ones
// 2. export is to gltf
// 3. import it in Blender
//    - Show how to load a gltf model in Blender
//    - Render without changing anything and show how it looks in Blender output
// 4. render it in Blender
//
//
// Images to capture in Blender
//   - Explain how to load
import { bootstrapGeometryScene } from '../chapter-6/util/standard-scene'
import { updateMesh } from '../chapter-6/util'
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry'
import { ParametricGeometries } from 'three/examples/jsm/geometries/ParametricGeometries'
import * as THREE from 'three'
import { getObjectsKeys } from '../../util'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'

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

const save = (blob, filename) => {
  const link = document.createElement('a')
  link.style.display = 'none'
  document.body.appendChild(link)
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

bootstrapGeometryScene({
  geometry,
  provideGui: (gui, mesh, scene) => {
    mesh.material.side = THREE.DoubleSide
    const folder = gui.addFolder('THREE.ParametricGeometry')
    folder.add(props, 'slices', 1, 100, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'stacks', 1, 100, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
    folder.add(props, 'func', getObjectsKeys(funcs)).onChange(() => updateMesh(mesh, updateGeometry(props)))

    const exporter = new GLTFExporter()
    const exportProps = {
      exportScene: () => {
        console.log('Exporting scene', scene)
        const options = {
          trs: false,
          onlyVisible: true,
          binary: false
        }
        exporter.parse(
          scene,
          function (result) {
            const output = JSON.stringify(result, null, 2)
            save(new Blob([output], { type: 'text/plain' }), 'out.gltf')
          },
          function (error) {
            console.log('An error happened during parsing', error)
          },
          options
        )
      }
    }

    gui.add(exportProps, 'exportScene')
  }
}).then()
