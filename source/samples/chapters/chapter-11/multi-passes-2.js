import { bootstrapMeshScene } from './util/standard-scene-seahouse'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'
import { TexturePass } from 'three/examples/jsm/postprocessing/TexturePass'
import * as THREE from 'three'
import { Vector2 } from 'three'
import {
  addGlitchPassControls,
  addHalftonePassControls,
  addOutlinePassControls,
  addUnrealBloomPassControls
} from './util/pass-controls'

const width = window.innerWidth || 2
const height = window.innerHeight || 2
const halfWidth = width / 2
const halfHeight = height / 2

const clock = new THREE.Clock()

const animate = (renderer, composers, mixer) => {
  renderer.clear()
  renderer.autoClear = false
  const delta = clock.getDelta()

  composers.renderedSceneComposer.render()

  renderer.setViewport(0, 0, halfWidth, halfHeight)
  composers.outlineComposer.render(delta)

  renderer.setViewport(halfWidth, 0, halfWidth, halfHeight)
  composers.glitchPassComposer.render(delta)

  renderer.setViewport(0, halfHeight, halfWidth, halfHeight)
  composers.unrealBloomPassComposer.render(delta)

  renderer.setViewport(halfWidth, halfHeight, halfWidth, halfHeight)
  composers.halftonePassComposer.render(delta)

  requestAnimationFrame(() => animate(renderer, composers, mixer))
}

let outlinePass = undefined
const unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.5)

console.log(unrealBloomPass)

const halftonePass = new HalftonePass()
const glitchPass = new GlitchPass()

let glitchPassComposer = undefined
let halftonePassComposer = undefined
let unrealBloomPassComposer = undefined

const setupComposer = (renderer, scene, camera, mesh) => {
  const effectCopy = new ShaderPass(CopyShader)
  const renderedSceneComposer = new EffectComposer(renderer)
  renderedSceneComposer.addPass(new RenderPass(scene, camera))
  renderedSceneComposer.addPass(new ShaderPass(GammaCorrectionShader))
  renderedSceneComposer.addPass(effectCopy)
  renderedSceneComposer.renderToScreen = false
  const texturePass = new TexturePass(renderedSceneComposer.renderTarget2.texture)

  outlinePass = new OutlinePass(new Vector2(128, 128), scene, camera, [mesh])
  const outlineComposer = new EffectComposer(renderer)
  outlineComposer.addPass(texturePass)
  outlineComposer.addPass(outlinePass)

  halftonePassComposer = new EffectComposer(renderer)
  halftonePassComposer.addPass(texturePass)
  halftonePassComposer.addPass(halftonePass)

  glitchPassComposer = new EffectComposer(renderer)
  glitchPassComposer.addPass(texturePass)
  glitchPassComposer.addPass(glitchPass)

  unrealBloomPassComposer = new EffectComposer(renderer)
  unrealBloomPassComposer.addPass(texturePass)
  unrealBloomPassComposer.addPass(unrealBloomPass)
  unrealBloomPassComposer.addPass(effectCopy)

  const copyComposer = new EffectComposer(renderer)
  copyComposer.addPass(texturePass)
  copyComposer.addPass(effectCopy)

  return {
    renderedSceneComposer,
    outlineComposer,
    halftonePassComposer,
    unrealBloomPassComposer,
    glitchPassComposer,
    copyComposer
  }
}

bootstrapMeshScene({
  addControls: (camera, renderer, scene, gui) => {
    const controls = new OrbitControls(camera, renderer.domElement)
    addGlitchPassControls(gui, {}, (updated) => {
      glitchPassComposer.passes[1] = updated
    })
    addOutlinePassControls(gui, {}, outlinePass)

    addUnrealBloomPassControls(gui, {}, (updated) => {
      unrealBloomPassComposer.passes[1] = updated
    })

    addHalftonePassControls(gui, { height: halfHeight, width: halfWidth }, (updated) => {
      halftonePassComposer.passes[1] = updated
    })

    return controls
  },
  initializeComposer: (renderer, scene, camera, mesh) => setupComposer(renderer, scene, camera, mesh),
  animate: (renderer, composer, mixer, clock) => animate(renderer, composer, mixer, clock)
}).then()
