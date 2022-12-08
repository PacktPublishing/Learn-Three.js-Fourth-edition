import { bootstrapMeshScene } from '../chapter-9/util/standard-scene'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { applyShadowsAndDepthWrite } from '../../util/modelUtil'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
import * as THREE from 'three'

const modelAsync = () => {
  const loader = new GLTFLoader()
  return loader.loadAsync('/assets/models/medieval_fantasy_book/scene.gltf').then((structure) => {
    // position scene
    structure.scene.scale.setScalar(0.8, 0.8, 0.8)
    structure.scene.translateY(-1.8)
    structure.scene.translateX(-1.8)

    // make sure all cast shadows
    applyShadowsAndDepthWrite(structure.scene)
    return structure.scene
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  hidefloor: true,
  addControls: (camera, renderer, scene, gui) => {
    const controls = new FirstPersonControls(camera, renderer.domElement)
    controls.movementSpeed = 3
    controls.lookSpeed = 0.1

    const folder = gui.addFolder('First Person Controls')
    folder.add(controls, 'activeLook')
    folder.add(controls, 'autoForward')
    folder.add(controls, 'enabled')
    folder.add(controls, 'heightCoef', 0, 10, 0.1)
    folder.add(controls, 'heightMax', 0, 10, 0.1)
    folder.add(controls, 'heightMin', 0, 10, 0.1)
    folder.add(controls, 'heightSpeed')
    folder.add(controls, 'lookVertical')
    folder.add(controls, 'lookSpeed', 0, 0.2, 0.0001)
    folder.add(controls, 'movementSpeed', 0, 10, 0.1)
    folder.add(controls, 'verticalMax', 0, Math.PI, 0.1)
    folder.add(controls, 'verticalMin', 0, Math.PI, 0.1)

    const listener = new THREE.AudioListener()
    camera.add(listener)

    const posSound1 = new THREE.PositionalAudio(listener)
    const posSound2 = new THREE.PositionalAudio(listener)
    const posSound3 = new THREE.PositionalAudio(listener)

    const props = {
      enableSounds: () => {
        posSound1.play()
        posSound2.play()
        posSound3.play()
      }
    }
    folder.add(props, 'enableSounds')

    const mesh1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial({ visible: false }))
    mesh1.position.set(-4, -2, 10)
    scene.add(mesh1)

    const mesh2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial({ visible: false }))
    mesh2.position.set(11, -2, 10)
    scene.add(mesh2)

    const mesh3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial({ visible: false }))
    mesh3.position.set(15, -3, -4)
    scene.add(mesh3)

    const audioLoader = new THREE.AudioLoader()

    audioLoader.load('/assets/sounds/cows.mp3', function (buffer) {
      posSound1.setBuffer(buffer)
      posSound1.setRefDistance(1)
      posSound1.setRolloffFactor(3)
      posSound1.setLoop(true)

      mesh3.add(posSound1)
    })

    audioLoader.load('/assets/sounds/sheep.mp3', function (buffer) {
      posSound2.setBuffer(buffer)
      posSound2.setRefDistance(1)
      posSound2.setRolloffFactor(3)
      posSound2.setLoop(true)

      mesh2.add(posSound2)
    })

    audioLoader.load('/assets/sounds/water.mp3', function (buffer) {
      posSound3.setBuffer(buffer)
      posSound3.setRefDistance(1)
      posSound3.setRolloffFactor(3)
      posSound3.setLoop(true)

      mesh1.add(posSound3)
    })

    return controls
  },
  onRender: (clock, controls) => {
    controls.update(clock.getDelta())
  }
}).then()
