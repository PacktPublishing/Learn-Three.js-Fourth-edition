import { bootstrapMeshScene } from './util/standard-scene'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { applyShadowsAndDepthWrite, visitChildren } from '../../util/modelUtil'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'
import { initializeGuiMaterial, initializeGuiMeshStandardMaterial } from '../../controls/material-controls'
import { initializeAnimationControls } from '../../controls/animation-controls'

let animations = []

const loadModel = () => {
  const loader = new GLTFLoader()
  return loader.loadAsync('/assets/models/blender-morph-targets/morph-targets.gltf').then((container) => {
    applyShadowsAndDepthWrite(container.scene)
    animations = container.animations
    return container.scene
  })
}

let mixer = undefined

bootstrapMeshScene({
  loadMesh: loadModel,
  addControls: (camera, renderer, scene, gui, mesh) => {
    const controls = new OrbitControls(camera, renderer.domElement)
    initializeGuiMaterial(gui, mesh.children[0], mesh.children[0].material).close()
    initializeGuiMeshStandardMaterial(gui, mesh.children[0], mesh.children[0].material).close()

    mixer = new THREE.AnimationMixer(mesh)
    const action = mixer.clipAction(animations[0])

    // the first object is the mesh we want to work with
    const morphTargets = mesh.children[0].morphTargetInfluences

    const props = {
      cubeTarget: 0,
      coneTarget: 0
    }

    const folder = gui.addFolder('MorphTargets')
    folder.add(props, 'cubeTarget', 0, 1, 0.01).onChange((ev) => (morphTargets[0] = ev))
    folder.add(props, 'coneTarget', 0, 1, 0.01).onChange((ev) => (morphTargets[1] = ev))

    initializeAnimationControls(mixer, action, animations[0], gui)

    return controls
  },
  onRender: (clock) => {
    if (mixer) {
      mixer.update(clock.getDelta())
    }
  }
}).then()
