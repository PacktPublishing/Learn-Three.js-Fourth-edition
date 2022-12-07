import { bootstrapMeshScene } from './util/standard-scene-empty'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { addShaderControl } from './util/pass-controls'
import * as THREE from 'three'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js'

const animate = (renderer, composer) => {
  renderer.autoClear = false
  requestAnimationFrame(() => animate(renderer, composer))
  composer.render()
}

let ssaoPass = undefined

const width = window.innerWidth
const height = window.innerHeight

const setupComposer = (renderer, scene, camera) => {
  ssaoPass = new SSAOPass(scene, camera, width, height)
  ssaoPass.kernelRadius = 16
  const composer = new EffectComposer(renderer)
  composer.addPass(ssaoPass)

  return composer
}

const addElementsToScene = (scene) => {
  const totalWidth = 250
  const boxSize = 40
  const nBoxes = 160
  const group = new THREE.Group()
  for (let i = 0; i < nBoxes; i++) {
    const box = new THREE.BoxGeometry(boxSize, boxSize, boxSize)
    const mat = new THREE.MeshLambertMaterial({ color: new THREE.Color(1 * (Math.random() / 2) + 0.5, 1, 1) })
    const mesh = new THREE.Mesh(box, mat)

    mesh.position.x = Math.random() * totalWidth - totalWidth / 2
    mesh.position.y = Math.random() * totalWidth - totalWidth / 2
    mesh.position.z = Math.random() * totalWidth - totalWidth / 2

    mesh.rotation.set(Math.random(), Math.random(), Math.random())

    group.add(mesh)
  }
  scene.add(group)
}

bootstrapMeshScene({
  initializeScene: (scene) => addElementsToScene(scene),
  addControls: (camera, renderer, scene, gui) => {
    camera.position.z = 500
    new OrbitControls(camera, renderer.domElement)

    gui.add(ssaoPass, 'kernelRadius').min(0).max(32)
    gui.add(ssaoPass, 'minDistance').min(0.001).max(0.02)
    gui.add(ssaoPass, 'maxDistance').min(0.01).max(0.3)
    gui
      .add(ssaoPass, 'output', {
        Default: SSAOPass.OUTPUT.Default,
        'SSAO Only': SSAOPass.OUTPUT.SSAO,
        'SSAO Only + Blur': SSAOPass.OUTPUT.Blur,
        Beauty: SSAOPass.OUTPUT.Beauty,
        Depth: SSAOPass.OUTPUT.Depth,
        Normal: SSAOPass.OUTPUT.Normal
      })
      .onChange(function (value) {
        ssaoPass.output = parseInt(value)
      })
  },
  initializeComposer: (renderer, scene, camera) => setupComposer(renderer, scene, camera),
  animate: (renderer, composer) => animate(renderer, composer)
}).then()
