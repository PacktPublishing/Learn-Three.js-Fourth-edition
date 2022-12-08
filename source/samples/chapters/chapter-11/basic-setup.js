import { bootstrapMeshScene } from './util/standard-scene-mushroom'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { applyShadowsAndDepthWrite } from '../../util/modelUtil'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import { DotScreenShader } from 'three/examples/jsm/shaders/DotScreenShader.js'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js'

const loadModel = () => {
  const loader = new GLTFLoader()
  return loader.loadAsync('/assets/models/truffle_man/scene.gltf').then((container) => {
    container.scene.scale.setScalar(4)
    container.scene.translateY(-2)
    applyShadowsAndDepthWrite(container.scene)
    return container.scene
  })
}

const animate = (renderer, composer) => {
  renderer.autoClear = false
  requestAnimationFrame(() => animate(renderer, composer))
  composer.render()
}

const effect1 = new ShaderPass(DotScreenShader)
effect1.uniforms['scale'].value = 10
effect1.enabled = false

const effect2 = new ShaderPass(RGBShiftShader)
effect2.uniforms['amount'].value = 0.015
effect2.enabled = false

const effectCopy = new ShaderPass(CopyShader)
effectCopy.renderToScreen = true

const setupConsumer = (renderer, scene, camera) => {
  const composer = new EffectComposer(renderer)

  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(effect1)
  composer.addPass(effect2)
  // composer.addPass(glitchPass)

  return composer
}

bootstrapMeshScene({
  loadMesh: loadModel,
  addControls: (camera, renderer, scene, gui, mesh) => {
    const controls = new OrbitControls(camera, renderer.domElement)

    const dotScreenEffectFolder = gui.addFolder('ShaderPass - DotScreenShader')
    const dotScreenEffectFolderProps = {
      scale: 10,
      enabled: false
    }
    dotScreenEffectFolder
      .add(dotScreenEffectFolderProps, 'scale', 1, 100, 1)
      .onChange((v) => (effect1.uniforms['scale'].value = v))
    dotScreenEffectFolder.add(dotScreenEffectFolderProps, 'enabled').onChange((v) => (effect1.enabled = v))

    const RGBShiftEffectFolder = gui.addFolder('ShaderPass - RGBShiftEffect')
    const RGBShiftEffectFolderProps = {
      amount: 0.015,
      enabled: false
    }
    RGBShiftEffectFolder.add(RGBShiftEffectFolderProps, 'amount', 0, 0.25, 0.001).onChange(
      (v) => (effect2.uniforms['amount'].value = v)
    )
    RGBShiftEffectFolder.add(RGBShiftEffectFolderProps, 'enabled').onChange((v) => (effect2.enabled = v))

    // const bloomPassEffectFolder = gui.addFolder('Bloompass')
    // const bloomPassEffectProps = {
    //   strength?: number,
    //   kernelSize?: number,
    //   sigma?: number,
    //   resolution?: number
    // }

    return controls
  },
  initializeComposer: (renderer, scene, camera) => setupConsumer(renderer, scene, camera),
  animate: (renderer, composer) => animate(renderer, composer)
}).then()
