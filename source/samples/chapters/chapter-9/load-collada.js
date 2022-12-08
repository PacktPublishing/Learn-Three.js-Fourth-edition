import { bootstrapMeshScene } from './util/standard-scene'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader'
import { applyShadowsAndDepthWrite, visitChildren } from '../../util/modelUtil'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'
import { initializeAnimationControls } from '../../controls/animation-controls'

const loadModel = () => {
  const loader = new ColladaLoader()
  return loader.loadAsync('/assets/models/monster/monster.dae').then((container) => {
    applyShadowsAndDepthWrite(container.scene)
    container.scene.scale.set(0.002, 0.002, 0.002)
    container.scene.translateX(-3)
    container.scene.translateY(-2)
    container.scene.translateZ(-1.7)

    // somehow the uv attributes get mapped to uv2 instead of uv
    // so fix this so the material gets applied correctly
    visitChildren(container.scene, (child) => {
      if (child.geometry) {
        child.castShadow = true
        if (child.geometry.getAttribute) {
          let uv2 = child.geometry.attributes['uv2']
          if (uv2) {
            child.geometry.attributes['uv'] = child.geometry.attributes['uv2']
          }
        }
      }
    })
    return container.scene
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
    const clip = THREE.AnimationClip.findByName(clips, 'AnimationClip')
    const action = mixer.clipAction(clip)
    action.play()

    initializeAnimationControls(mixer, action, mesh.animations, gui)

    return controls
  },
  onRender: (clock) => {
    if (mixer) {
      mixer.update(clock.getDelta())
    }
  }
}).then()
