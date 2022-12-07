import { bootstrapMeshScene } from './util/standard-scene-mushroom'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'

const animate = (renderer, composer, mixer, clock) => {
  renderer.autoClear = false
  requestAnimationFrame(() => animate(renderer, composer, mixer, clock))
  if (mixer) {
    mixer.update(clock.getDelta())
  }
  composer.render()
}

const filmpass = new FilmPass()

const setupComposer = (renderer, scene, camera) => {
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(filmpass)
  return composer
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

    return controls
  },
  initializeComposer: (renderer, scene, camera) => setupComposer(renderer, scene, camera),
  animate: (renderer, composer, mixer, clock) => animate(renderer, composer, mixer, clock)
}).then()
