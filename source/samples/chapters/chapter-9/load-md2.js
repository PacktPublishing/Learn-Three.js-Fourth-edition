import { bootstrapMeshScene } from './util/standard-scene'
import { MD2Loader } from 'three/examples/jsm/loaders/MD2Loader'
import { applyShadowsAndDepthWrite } from '../../util/modelUtil'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'
import { initializeAnimationControls } from '../../controls/animation-controls'

let animations = []
const loadModel = () => {
  const loader = new MD2Loader()
  return loader.loadAsync('/assets/models/ogre/ogro.md2').then((object) => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0,
      map: new THREE.TextureLoader().load('/assets/models/ogre/skins/skin.jpg')
    })

    animations = object.animations

    const mesh = new THREE.Mesh(object, mat)
    applyShadowsAndDepthWrite(mesh)
    mesh.scale.setScalar(0.1)
    mesh.translateY(0.5)
    return mesh
  })
}

let mixer = undefined

bootstrapMeshScene({
  loadMesh: loadModel,
  addControls: (camera, renderer, scene, gui, mesh) => {
    const controls = new OrbitControls(camera, renderer.domElement)
    console.log(mesh.animations)

    mixer = new THREE.AnimationMixer(mesh)
    const action = mixer.clipAction(animations[9])
    action.play()
    initializeAnimationControls(mixer, action, animations[0], gui)

    return controls
  },
  onRender: (clock) => {
    if (mixer) {
      mixer.update(clock.getDelta())
    }
  }
}).then()
