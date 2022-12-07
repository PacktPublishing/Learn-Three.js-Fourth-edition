import { bootstrapMeshScene } from '../chapter-8/util/standard-scene'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { applyShadowsAndDepthWrite } from '../../util/modelUtil'
import * as THREE from 'three'

const mixers = []
const clock = new THREE.Clock()
const onRender = () => {
  const delta = clock.getDelta()
  mixers.forEach((mixer) => {
    mixer.update(delta)
  })
}

const modelAsync = () => {
  const loader = new GLTFLoader()
  return loader.loadAsync('/assets/models/blender-cells/fracture.glb').then((structure) => {
    console.log(structure)

    // setup the ground plane
    const planeMesh = structure.scene.getObjectByName('Plane')
    planeMesh.material.side = THREE.DoubleSide
    planeMesh.material.color = new THREE.Color(0xff5555)

    // setup the material for the pieces
    const materialPieces = new THREE.MeshStandardMaterial({ color: 0xffcc33 })

    structure.animations.forEach((animation) => {
      const meshName = animation.name.substring(0, animation.name.indexOf('Action')).replace('.', '')
      const mesh = structure.scene.getObjectByName(meshName)
      mesh.material = materialPieces
      const mixer = new THREE.AnimationMixer(mesh)
      const action = mixer.clipAction(animation)
      action.play()
      mixers.push(mixer)
    })
    applyShadowsAndDepthWrite(structure.scene)

    return structure.scene
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  onRender: onRender,
  hidefloor: true
}).then()
