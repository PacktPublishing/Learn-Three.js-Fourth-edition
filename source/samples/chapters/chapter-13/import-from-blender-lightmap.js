import { bootstrapMeshScene } from '../chapter-8/util/standard-scene'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import { applyShadowsAndDepthWrite, visitChildren } from '../../util/modelUtil'

const cubeLightMap = new THREE.TextureLoader().load('/assets/models/blender-lightmaps/cube-light-map.png')
const cylinderLightMap = new THREE.TextureLoader().load('/assets/models/blender-lightmaps/cylinder-light-map.png')
const roomLightMap = new THREE.TextureLoader().load('/assets/models/blender-lightmaps/room-light-map.png')
const torusLightMap = new THREE.TextureLoader().load('/assets/models/blender-lightmaps/torus-light-map.png')

const addLightMap = (mesh, lightMap) => {
  const uv1 = mesh.geometry.getAttribute('uv')
  const uv2 = uv1.clone()
  mesh.geometry.setAttribute('uv2', uv2)
  mesh.material.lightMap = lightMap
  lightMap.flipY = false
}

const modelAsync = () => {
  const loader = new GLTFLoader()
  return loader.loadAsync('/assets/models/blender-lightmaps/light-map.glb').then((structure) => {
    const cubeMesh = structure.scene.getObjectByName('Cube')
    const cylinderMesh = structure.scene.getObjectByName('Cylinder')
    const torusMesh = structure.scene.getObjectByName('Torus')
    const roomMesh = structure.scene.getObjectByName('Plane')

    addLightMap(cubeMesh, cubeLightMap)
    addLightMap(cylinderMesh, cylinderLightMap)
    addLightMap(torusMesh, torusLightMap)
    addLightMap(roomMesh, roomLightMap)

    return structure.scene
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  hidefloor: true,
  disableLights: true
}).then()
