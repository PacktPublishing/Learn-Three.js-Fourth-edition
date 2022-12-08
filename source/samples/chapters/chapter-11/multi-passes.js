import { bootstrapMeshScene } from './util/standard-scene-seahouse'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass'
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'
import { TexturePass } from 'three/examples/jsm/postprocessing/TexturePass'
import * as THREE from 'three'
import { addBloomPassControls } from './util/pass-controls'

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
  composers.filmpassComposer.render(delta)

  renderer.setViewport(halfWidth, 0, halfWidth, halfHeight)
  composers.dotScreenPassComposer.render(delta)

  renderer.setViewport(0, halfHeight, halfWidth, halfHeight)
  composers.bloomPassComposer.render(delta)

  renderer.setViewport(halfWidth, halfHeight, halfWidth, halfHeight)
  composers.copyComposer.render(delta)

  requestAnimationFrame(() => animate(renderer, composers, mixer))
}

const filmpass = new FilmPass()
const dotScreenPass = new DotScreenPass()
const bloomPass = new BloomPass()

let bloomPassComposer = undefined

const setupComposer = (renderer, scene, camera) => {
  const effectCopy = new ShaderPass(CopyShader)
  const renderedSceneComposer = new EffectComposer(renderer)
  renderedSceneComposer.addPass(new RenderPass(scene, camera))
  renderedSceneComposer.addPass(new ShaderPass(GammaCorrectionShader))
  renderedSceneComposer.addPass(effectCopy)
  renderedSceneComposer.renderToScreen = false
  const texturePass = new TexturePass(renderedSceneComposer.renderTarget2.texture)

  const filmpassComposer = new EffectComposer(renderer)
  filmpassComposer.addPass(texturePass)
  filmpassComposer.addPass(filmpass)

  const dotScreenPassComposer = new EffectComposer(renderer)
  dotScreenPassComposer.addPass(texturePass)
  dotScreenPassComposer.addPass(dotScreenPass)

  bloomPassComposer = new EffectComposer(renderer)
  bloomPassComposer.addPass(texturePass)
  bloomPassComposer.addPass(bloomPass)
  bloomPassComposer.addPass(effectCopy)

  const copyComposer = new EffectComposer(renderer)
  copyComposer.addPass(texturePass)
  copyComposer.addPass(effectCopy)

  return { renderedSceneComposer, filmpassComposer, dotScreenPassComposer, bloomPassComposer, copyComposer }
}

bootstrapMeshScene({
  addControls: (camera, renderer, scene, gui) => {
    const controls = new OrbitControls(camera, renderer.domElement)

    const filmPassFolder = gui.addFolder('Filmpass')
    const filmPassProps = {
      noiseIntensity: 0.5,
      scanlinesIntensity: 0.05,
      scanlinesCount: 4096,
      grayscale: true
    }

    filmPassFolder
      .add(filmPassProps, 'noiseIntensity', 0, 1, 0.1)
      .onChange((v) => (filmpass.uniforms.nIntensity.value = v))
    filmPassFolder
      .add(filmPassProps, 'scanlinesIntensity', 0, 1, 0.001)
      .onChange((v) => (filmpass.uniforms.sIntensity.value = v))
    filmPassFolder
      .add(filmPassProps, 'scanlinesCount', 0, 10000, 10)
      .onChange((v) => (filmpass.uniforms.sCount.value = v))
    filmPassFolder.add(filmPassProps, 'grayscale').onChange((v) => (filmpass.uniforms.grayscale.value = v))

    const dotScreenEffectFolder = gui.addFolder('DotScreenPass')
    const dotScreenEffectFolderProps = {
      scale: 10
    }
    dotScreenEffectFolder
      .add(dotScreenEffectFolderProps, 'scale', 1, 100, 1)
      .onChange((v) => (dotScreenPass.uniforms['scale'].value = v))

    addBloomPassControls(gui, controls, (updated) => {
      bloomPassComposer.passes[1] = updated
    })
    return controls
  },
  initializeComposer: (renderer, scene, camera) => setupComposer(renderer, scene, camera),
  animate: (renderer, composer, mixer, clock) => animate(renderer, composer, mixer, clock)
}).then()
