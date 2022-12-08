import { bootstrapMeshScene } from './util/standard-scene-mushroom'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'
import { ColorifyShader } from 'three/examples/jsm/shaders/ColorifyShader'
import { BleachBypassShader } from 'three/examples/jsm/shaders/BleachBypassShader'
import { BrightnessContrastShader } from 'three/examples/jsm/shaders/BrightnessContrastShader'
import { ColorCorrectionShader } from 'three/examples/jsm/shaders/ColorCorrectionShader'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'
import { HueSaturationShader } from 'three/examples/jsm/shaders/HueSaturationShader'
import { KaleidoShader } from 'three/examples/jsm/shaders/KaleidoShader'
import { LuminosityHighPassShader } from 'three/examples/jsm/shaders/LuminosityHighPassShader'
import { LuminosityShader } from 'three/examples/jsm/shaders/LuminosityShader'
import { MirrorShader } from 'three/examples/jsm/shaders/MirrorShader'
import { PixelShader } from 'three/examples/jsm/shaders/PixelShader'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader'
import { SepiaShader } from 'three/examples/jsm/shaders/SepiaShader'
import { SobelOperatorShader } from 'three/examples/jsm/shaders/SobelOperatorShader'
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader'

import * as THREE from 'three'
import { addShaderControl } from './util/pass-controls'

const effectCopy = new ShaderPass(CopyShader)
effectCopy.renderToScreen = true
const bleachByPassFilter = new ShaderPass(BleachBypassShader)
const brightnessContrastShader = new ShaderPass(BrightnessContrastShader)
const colorifyShader = new ShaderPass(ColorifyShader)
const colorCorrectionShader = new ShaderPass(ColorCorrectionShader)
const gammaCorrectionShader = new ShaderPass(GammaCorrectionShader)
const hueSaturationShader = new ShaderPass(HueSaturationShader)
const kaleidoShader = new ShaderPass(KaleidoShader)
const luminosityHighPassShader = new ShaderPass(LuminosityHighPassShader)
const luminosityShader = new ShaderPass(LuminosityShader)
const mirrorShader = new ShaderPass(MirrorShader)
const pixelShader = new ShaderPass(PixelShader)
pixelShader.uniforms.resolution.value = new THREE.Vector2(256, 256)
const rgbShiftShader = new ShaderPass(RGBShiftShader)
const sepiaShader = new ShaderPass(SepiaShader)
const sobelOperatorShader = new ShaderPass(SobelOperatorShader)
sobelOperatorShader.uniforms.resolution.value = new THREE.Vector2(256, 256)
const vignetteShader = new ShaderPass(VignetteShader)

const setupComposer = (renderer, scene, camera) => {
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(bleachByPassFilter)
  composer.addPass(brightnessContrastShader)
  composer.addPass(colorifyShader)
  composer.addPass(colorCorrectionShader)
  composer.addPass(hueSaturationShader)
  composer.addPass(kaleidoShader)
  composer.addPass(luminosityHighPassShader)
  composer.addPass(luminosityShader)
  composer.addPass(mirrorShader)
  composer.addPass(pixelShader)
  composer.addPass(rgbShiftShader)
  composer.addPass(sepiaShader)
  composer.addPass(sobelOperatorShader)
  composer.addPass(vignetteShader)
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
    addShaderControl(gui, 'BleachBypass', bleachByPassFilter, {
      floats: [{ key: 'opacity', from: 0, to: 2, step: 0.01 }]
    })
    addShaderControl(gui, 'BrightnessContrast', brightnessContrastShader, {
      floats: [
        { key: 'brightness', from: 0, to: 1, step: 0.01 },
        { key: 'contrast', from: 0, to: 1, step: 0.01 }
      ]
    })
    addShaderControl(gui, 'Colorify', colorifyShader, { colors: [{ key: 'color' }] })
    addShaderControl(gui, 'ColorCorrection', colorCorrectionShader, {
      vector3: [
        { key: 'powRGB', from: { x: 0, y: 0, z: 0 }, to: { x: 5, y: 5, z: 5 }, step: { x: 0.01, y: 0.01, z: 0.01 } },
        { key: 'mulRGB', from: { x: 0, y: 0, z: 0 }, to: { x: 5, y: 5, z: 5 }, step: { x: 0.01, y: 0.01, z: 0.01 } },
        { key: 'addRGB', from: { x: 0, y: 0, z: 0 }, to: { x: 1, y: 1, z: 1 }, step: { x: 0.01, y: 0.01, z: 0.01 } }
      ]
    })
    addShaderControl(gui, 'GammaCorrection', gammaCorrectionShader, {}, true)
    addShaderControl(gui, 'HueSaturation', hueSaturationShader, {
      floats: [
        { key: 'hue', from: -1, to: 1, step: 0.01 },
        { key: 'saturation', from: -1, to: 1, step: 0.01 }
      ]
    })
    addShaderControl(gui, 'Kaleido', kaleidoShader, {
      floats: [
        { key: 'sides', from: 0, to: 20, step: 1 },
        { key: 'angle', from: 0, to: 6.28, step: 0.01 }
      ]
    })
    addShaderControl(gui, 'LuminosityHighPass', luminosityHighPassShader, {
      colors: [{ key: 'defaultColor' }],
      floats: [
        { key: 'luminosityThreshold', from: 0, to: 0.5, step: 0.0001 },
        { key: 'smoothWidth', from: 0, to: 1, step: 0.001 },
        { key: 'defaultOpacity', from: 0, to: 1, step: 0.01 }
      ]
    })
    addShaderControl(gui, 'Luminosity', luminosityShader, {})
    addShaderControl(gui, 'Mirror', mirrorShader, { floats: [{ key: 'side', from: 0, to: 3, step: 1 }] })
    addShaderControl(gui, 'Pixel', pixelShader, {
      vector2: [{ key: 'resolution', from: { x: 2, y: 2 }, to: { x: 512, y: 512 }, step: { x: 1, y: 1 } }],
      floats: [{ key: 'pixelSize', from: 0, to: 10, step: 1 }]
    })
    addShaderControl(gui, 'rgbShift', rgbShiftShader, {
      floats: [
        { key: 'angle', from: 0, to: 6.28, step: 0.001 },
        { key: 'amount', from: 0, to: 0.5, step: 0.001 }
      ]
    })
    addShaderControl(gui, 'sepia', sepiaShader, { floats: [{ key: 'amount', from: 0, to: 10, step: 0.01 }] })
    addShaderControl(gui, 'sobelOperator', sobelOperatorShader, {
      vector2: [{ key: 'resolution', from: { x: 2, y: 2 }, to: { x: 512, y: 512 }, step: { x: 1, y: 1 } }]
    })
    addShaderControl(gui, 'vignette', vignetteShader, {
      floats: [
        { key: 'offset', from: 0, to: 10, step: 0.01 },
        { key: 'darkness', from: 0, to: 10, step: 0.01 }
      ]
    })
    return gui
  },
  initializeComposer: (renderer, scene, camera) => setupComposer(renderer, scene, camera),
  animate: (renderer, composer, mixer, clock) => animate(renderer, composer, mixer, clock)
}).then()
