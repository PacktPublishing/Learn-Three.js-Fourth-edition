import { bootstrapMeshScene } from './util/standard-scene'
import { KMZLoader } from 'three/examples/jsm/loaders/KMZLoader'
import { visitChildren } from '../../util/modelUtil'
import * as THREE from 'three'

const modelAsync = () => {
  const loader = new KMZLoader()
  return loader.loadAsync('/assets/models/hawaii/MackyBldg.kmz').then((complete) => {
    const mainMesh = complete.scene.children[0]
    mainMesh.scale.set(0.003, 0.003, 0.003)
    // const helper = new THREE.BoxHelper(mainMesh, 0xff0000)
    // helper.update()
    // console.log(mainMesh)

    const meshNormalMaterial = new THREE.MeshNormalMaterial()
    visitChildren(mainMesh, (child) => {
      if (child.material) {
        child.material = meshNormalMaterial
      }
    })

    const group = new THREE.Group()
    // group.add(helper)
    group.add(mainMesh)
    return group
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  floorSize: 200,
  hidefloor: true
}).then()
