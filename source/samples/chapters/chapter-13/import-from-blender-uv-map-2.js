import { bootstrapMeshScene } from '../chapter-8/util/standard-scene'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import { applyShadowsAndDepthWrite, visitChildren } from '../../util/modelUtil'

const modelAsync = () => {
  const loader = new GLTFLoader()
  return loader.loadAsync('/assets/models/blender-uvs/uvs-2.glb').then((structure) => {
    applyShadowsAndDepthWrite(structure.scene)
    return structure.scene
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  hidefloor: true
}).then()
