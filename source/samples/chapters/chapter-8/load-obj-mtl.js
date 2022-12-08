import { bootstrapMeshScene } from './util/standard-scene'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { visitChildren } from '../../util/modelUtil'
import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'

const mtlLoader = new MTLLoader()
const objLoader = new OBJLoader()

const loadModel = () => {
  return mtlLoader.loadAsync('/assets/models/butterfly/butterfly.mtl').then((materials) => {
    objLoader.setMaterials(materials)
    return objLoader.loadAsync('/assets/models/butterfly/butterfly.obj').then((model) => {
      model.scale.set(30, 30, 30)
      visitChildren(model, (child) => {
        // if there are already normals, we can't merge vertices
        child.geometry.deleteAttribute('normal')
        child.geometry = BufferGeometryUtils.mergeVertices(child.geometry, 0.001)
        child.geometry.computeVertexNormals()
        child.material.opacity = 0.1
        child.castShadow = true
      })

      const wing1 = model.children[4]
      const wing2 = model.children[5]

      ;[0, 2, 4, 6].forEach(function (i) {
        model.children[i].rotation.z = 0.3 * Math.PI
      })
      ;[1, 3, 5, 7].forEach(function (i) {
        model.children[i].rotation.z = -0.3 * Math.PI
      })

      wing1.material.opacity = 0.9
      wing1.material.transparent = true
      wing1.material.alphaTest = 0.1
      wing1.material.side = THREE.DoubleSide

      wing2.material.opacity = 0.9
      wing2.material.depthTest = false
      wing2.material.transparent = true
      wing2.material.alphaTest = 0.1
      wing2.material.side = THREE.DoubleSide

      return model
    })
  })
}

bootstrapMeshScene({
  loadMesh: loadModel,
  hidefloor: true
}).then()
