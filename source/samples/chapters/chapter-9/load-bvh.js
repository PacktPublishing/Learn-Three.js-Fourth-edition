import { bootstrapMeshScene } from './util/standard-scene'
import { BVHLoader } from 'three/examples/jsm/loaders/BVHLoader'
import { applyShadowsAndDepthWrite } from '../../util/modelUtil'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'

let animation = undefined
const loadModel = () => {
  const loader = new BVHLoader()
  return loader.loadAsync('/assets/models//amelia-dance/DanceNightClub7_t1.bvh').then((result) => {
    const skeletonHelper = new THREE.SkeletonHelper(result.skeleton.bones[0])
    skeletonHelper.skeleton = result.skeleton
    skeletonHelper.name = 'skeletonHelper'
    const boneContainer = new THREE.Group()
    boneContainer.add(result.skeleton.bones[0])
    boneContainer.name = 'boneContainer'
    animation = result.clip

    const group = new THREE.Group()
    group.add(skeletonHelper)
    group.add(boneContainer)
    group.scale.setScalar(0.2)
    group.translateY(-1.6)
    group.translateX(-3)
    applyShadowsAndDepthWrite(group)

    return group
  })
}

let mixer = undefined

bootstrapMeshScene({
  loadMesh: loadModel,
  addControls: (camera, renderer, scene, gui, mesh) => {
    const controls = new OrbitControls(camera, renderer.domElement)

    // play animation
    mixer = new THREE.AnimationMixer(mesh.getObjectByName('skeletonHelper'))
    mixer.clipAction(animation).play()
    return controls
  },
  onRender: (clock) => {
    if (mixer) {
      mixer.update(clock.getDelta())
    }
  }
}).then()
