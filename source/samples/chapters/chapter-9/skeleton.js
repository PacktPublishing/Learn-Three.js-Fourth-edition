import { bootstrapMeshScene } from './util/standard-scene'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { applyShadowsAndDepthWrite, findChild, visitChildren } from '../../util/modelUtil'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'
import { addMeshProperties } from '../../controls/mesh-controls'

let animations = []
const loadModel = () => {
  const loader = new GLTFLoader()
  return loader.loadAsync('/assets/models/blender-skeleton/lpp-rigging.gltf').then((container) => {
    container.scene.translateY(-2)
    applyShadowsAndDepthWrite(container.scene)
    visitChildren(container.scene, (c) => {
      if (c.material) {
        c.material.opacity = 0.4
        c.material.transparent = true
      }
    })
    animations = container.animations
    return container.scene
  })
}

let mixer = undefined

bootstrapMeshScene({
  loadMesh: loadModel,
  addControls: (camera, renderer, scene, gui, mesh) => {
    const controls = new OrbitControls(camera, renderer.domElement)
    const props = {
      animationIsPlaying: false,
      toggleSkeletonHelper: () => {
        const sh = scene.getObjectByName('skeletonHelper')
        if (sh) scene.remove(sh)

        const helper = new THREE.SkeletonHelper(mesh)
        helper.name = 'skeletonHelper'
        console.log(helper)
        scene.add(helper)
      }
    }

    mixer = new THREE.AnimationMixer(mesh)
    const action = mixer.clipAction(animations[0]).setEffectiveTimeScale(4)

    const centerBone = findChild(mesh, 'Bone')
    const neckBone = findChild(mesh, 'Bone003')
    const legBone = findChild(mesh, 'Bone015')
    const armBone = findChild(mesh, 'Bone006')

    const folder = gui.addFolder('Bones')
    addMeshProperties(gui, centerBone, 'centerBone')
    addMeshProperties(gui, neckBone, 'neckBone')
    addMeshProperties(gui, legBone, 'legBone')
    addMeshProperties(gui, armBone, 'armBone')

    folder.add(props, 'animationIsPlaying').onChange((ev) => (ev ? action.play() : action.stop()))
    folder.add(props, 'toggleSkeletonHelper')

    return controls
  },
  onRender: (clock) => {
    if (mixer) {
      mixer.update(clock.getDelta())
    }
  }
}).then()
