import { bootstrapMeshScene } from './util/standard-scene-mushroom'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'

import { addShaderControl } from './util/pass-controls'
import { CustomBitShader, CustomGrayScaleShader } from './custom-shader'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'

const effectCopy = new ShaderPass(CopyShader)
effectCopy.renderToScreen = true
const grayScaleShader = new ShaderPass(CustomGrayScaleShader)
const gammaCorrectionShader = new ShaderPass(GammaCorrectionShader)
const customBitShader = new ShaderPass(CustomBitShader)

const setupComposer = (renderer, scene, camera) => {
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(grayScaleShader)
  composer.addPass(customBitShader)
  composer.addPass(gammaCorrectionShader)
  composer.addPass(effectCopy)
  return composer
}

const animate = (renderer, composer) => {
  renderer.autoClear = false
  requestAnimationFrame(() => animate(renderer, composer))
  composer.render()
}

bootstrapMeshScene({
  addControls: (camera, renderer, scene, gui) => {
    new OrbitControls(camera, renderer.domElement)
    addShaderControl(gui, 'grayScaleShader', grayScaleShader, {
      floats: [
        { key: 'rPower', from: 0, to: 2, step: 0.01 },
        { key: 'gPower', from: 0, to: 2, step: 0.01 },
        { key: 'bPower', from: 0, to: 2, step: 0.01 }
      ]
    })
    addShaderControl(gui, 'customBitShader', customBitShader, {
      floats: [{ key: 'bitSize', from: 1, to: 24, step: 1 }]
    })
    return gui
  },
  initializeComposer: (renderer, scene, camera) => setupComposer(renderer, scene, camera),
  animate: (renderer, composer, mixer, clock) => animate(renderer, composer, mixer, clock)
}).then()
