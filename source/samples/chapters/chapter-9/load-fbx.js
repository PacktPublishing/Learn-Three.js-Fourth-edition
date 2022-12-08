import { bootstrapMeshScene } from './util/standard-scene'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { applyShadowsAndDepthWrite, visitChildren } from '../../util/modelUtil'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'
import { initializeAnimationControls } from '../../controls/animation-controls'

const loadModel = () => {
  const loader = new FBXLoader()
  return loader.loadAsync('/assets/models/salsa/salsa.fbx').then((container) => {
    container.translateX(-0.8)
    container.translateY(-1.9)
    container.scale.set(0.03, 0.03, 0.03)
    applyShadowsAndDepthWrite(container)
    return container
  })
}

let mixer = undefined

bootstrapMeshScene({
  floorSize: 11,
  loadMesh: loadModel,
  addControls: (camera, renderer, scene, gui, mesh) => {
    const controls = new OrbitControls(camera, renderer.domElement)

    mixer = new THREE.AnimationMixer(mesh)
    const clips = mesh.animations
    const clip = THREE.AnimationClip.findByName(clips, 'mixamo.com')

    const action = mixer.clipAction(clip)
    action.play()

    initializeAnimationControls(mixer, action, mesh.animations, gui)

    return controls
  },
  onRender: (clock, controls, camera, scene) => {
    if (mixer) {
      mixer.update(clock.getDelta())
    }
  }
}).then()
