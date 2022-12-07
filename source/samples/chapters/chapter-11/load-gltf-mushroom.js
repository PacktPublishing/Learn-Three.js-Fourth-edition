// import { bootstrapMeshScene } from './util/standard-scene'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { applyShadowsAndDepthWrite } from '../../util/modelUtil'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import * as THREE from 'three'
// import { initializeAnimationControls } from '../../controls/animation-controls'

// let animations = []
// const loadModel = () => {
//   const loader = new GLTFLoader()
//   return loader.loadAsync('/assets/models/truffle_man/scene.gltf').then((container) => {
//     container.scene.scale.setScalar(4)
//     container.scene.translateY(-2)
//     applyShadowsAndDepthWrite(container.scene)
//     animations = container.animations
//     return container.scene
//   })
// }

// let mixer = undefined

// bootstrapMeshScene({
//   loadMesh: loadModel,
//   addControls: (camera, renderer, scene, gui, mesh) => {
//     const controls = new OrbitControls(camera, renderer.domElement)
//     mixer = new THREE.AnimationMixer(mesh)
//     const action = mixer.clipAction(animations[0])
//     action.play()

//     initializeAnimationControls(mixer, action, animations[0], gui)

//     return controls
//   },
//   onRender: (clock) => {
//     if (mixer) {
//       mixer.update(clock.getDelta())
//     }
//   }
// }).then()
