import { bootstrapMeshScene } from './util/standard-scene-empty'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass'
import { addShaderControl } from './util/pass-controls'
import * as THREE from 'three'
import { floatingFloor, foreverPlane } from '../../bootstrap/floor'

const animate = (renderer, composer) => {
  renderer.autoClear = false
  requestAnimationFrame(() => animate(renderer, composer))
  composer.render()
}

let bokehPass = undefined

const setupComposer = (renderer, scene, camera) => {
  bokehPass = new BokehPass(scene, camera, {
    focus: 6,
    aspect: camera.aspect,
    aperture: 0.025,
    maxblur: 1.0,
    width: window.width,
    height: window.height
  })
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(bokehPass)
  return composer
}

const addElementsToScene = (scene) => {
  const totalWidth = 20
  const nBoxes = 15
  for (let i = 0; i < nBoxes; i++) {
    const box = new THREE.BoxGeometry(1, 1, 1)
    const mat = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    const mesh = new THREE.Mesh(box, mat)
    mesh.position.z = -10
    mesh.position.x = -(totalWidth / 2) + (totalWidth / nBoxes) * i
    mesh.position.y = -1.5
    scene.add(mesh)
  }

  for (let i = 0; i < nBoxes; i++) {
    const box = new THREE.BoxGeometry(1, 1, 1)
    const mat = new THREE.MeshStandardMaterial({ color: 0xff0000 })
    const mesh = new THREE.Mesh(box, mat)
    mesh.position.z = -5
    mesh.position.x = -(totalWidth / 2) + (totalWidth / nBoxes) * i
    mesh.position.y = -1.5
    scene.add(mesh)
  }

  for (let i = 0; i < nBoxes; i++) {
    const box = new THREE.BoxGeometry(1, 1, 1)
    const mat = new THREE.MeshStandardMaterial({ color: 0x000066 })
    const mesh = new THREE.Mesh(box, mat)
    mesh.position.z = 2
    mesh.position.x = -(totalWidth / 2) + (totalWidth / nBoxes) * i
    scene.add(mesh)
    mesh.position.y = -1.5
  }

  const texture = new THREE.TextureLoader().load('/assets/textures/wood/floor-parquet-pattern-172292.jpg')
  floatingFloor(scene, 40).material = new THREE.MeshBasicMaterial({ map: texture })
}

bootstrapMeshScene({
  initializeScene: (scene) => addElementsToScene(scene),
  addControls: (camera, renderer, scene, gui) => {
    new OrbitControls(camera, renderer.domElement)
    addShaderControl(gui, 'Bokeh', bokehPass.materialBokeh, {
      floats: [
        { key: 'focus', from: 0, to: 20, step: 0.01 },
        { key: 'aperture', from: 0, to: 0.2, step: 0.000001 },
        { key: 'maxblur', from: 0, to: 1, step: 0.001 }
      ]
    })
  },
  initializeComposer: (renderer, scene, camera) => setupComposer(renderer, scene, camera),
  animate: (renderer, composer) => animate(renderer, composer)
}).then()
