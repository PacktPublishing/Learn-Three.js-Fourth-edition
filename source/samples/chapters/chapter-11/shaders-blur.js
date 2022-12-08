import { bootstrapMeshScene } from './util/standard-scene-empty'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'

import { HorizontalBlurShader } from 'three/examples/jsm/shaders/HorizontalBlurShader'
import { VerticalBlurShader } from 'three/examples/jsm/shaders/VerticalBlurShader'
import { HorizontalTiltShiftShader } from 'three/examples/jsm/shaders/HorizontalTiltShiftShader'
import { VerticalTiltShiftShader } from 'three/examples/jsm/shaders/VerticalTiltShiftShader'
import { TriangleBlurShader } from 'three/examples/jsm/shaders/TriangleBlurShader'
import { FocusShader } from 'three/examples/jsm/shaders/FocusShader'

import * as THREE from 'three'
import { addShaderControl } from './util/pass-controls'
import { floatingFloor, foreverPlane } from '../../bootstrap/floor'

const effectCopy = new ShaderPass(CopyShader)
effectCopy.renderToScreen = true
const horBlurShader = new ShaderPass(HorizontalBlurShader)
const verBlurShader = new ShaderPass(VerticalBlurShader)
const horTiltShiftShader = new ShaderPass(HorizontalTiltShiftShader)
const verTiltShiftShader = new ShaderPass(VerticalTiltShiftShader)
const focusShader = new ShaderPass(FocusShader)

const setupComposer = (renderer, scene, camera) => {
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(effectCopy)
  composer.addPass(horBlurShader)
  composer.addPass(verBlurShader)
  composer.addPass(horTiltShiftShader)
  composer.addPass(verTiltShiftShader)
  composer.addPass(focusShader)
  composer.addPass(effectCopy)
  return composer
}

const animate = (renderer, composer) => {
  requestAnimationFrame(() => animate(renderer, composer))
  composer.render()
}

bootstrapMeshScene({
  initializeScene: (scene) => {
    foreverPlane(scene)
    // add a whole lot of boxes
    const totalWidth = 20
    const totalDepth = 20
    const nBoxes = 51
    const mBoxes = 51
    const colors = [0x66ff00, 0x6600ff, 0x0066ff, 0xff6600, 0xff0066]
    for (let i = 0; i < nBoxes; i++) {
      for (let j = 0; j < mBoxes; j++) {
        const box = new THREE.BoxGeometry(0.3, 0.3, 0.3)
        const mat = new THREE.MeshStandardMaterial({
          color: colors[Math.round(Math.random() * 100) % 5],
          roughness: 0.6
        })
        const mesh = new THREE.Mesh(box, mat)
        mesh.position.z = -(totalDepth / 2) + (totalDepth / mBoxes) * j
        mesh.position.x = -(totalWidth / 2) + (totalWidth / nBoxes) * i
        mesh.position.y = -2
        mesh.castShadow = true
        scene.add(mesh)
      }
    }
  },
  addControls: (camera, renderer, scene, gui) => {
    camera.position.y = 3
    camera.position.x = 0
    camera.position.z = 1

    addShaderControl(gui, 'horizontalBlur', horBlurShader, { floats: [{ key: 'h', from: 0, to: 0.01, step: 0.0001 }] })
    addShaderControl(gui, 'verticalBlur', verBlurShader, { floats: [{ key: 'v', from: 0, to: 0.01, step: 0.0001 }] })
    addShaderControl(gui, 'horizontalTiltShift', horTiltShiftShader, {
      floats: [
        { key: 'r', from: 0, to: 1, step: 0.01 },
        { key: 'h', from: 0, to: 0.01, step: 0.0001 }
      ]
    })
    addShaderControl(gui, 'verticalTiltShift', verTiltShiftShader, {
      floats: [
        { key: 'r', from: 0, to: 1, step: 0.01 },
        { key: 'v', from: 0, to: 0.01, step: 0.0001 }
      ]
    })
    addShaderControl(gui, 'focus', focusShader, {
      floats: [
        { key: 'sampleDistance', from: 0, to: 10, step: 0.01 },
        { key: 'waveFactor', from: 0, to: 0.005, step: 0.0001 }
      ]
    })

    new OrbitControls(camera, renderer.domElement)
  },
  initializeComposer: (renderer, scene, camera) => setupComposer(renderer, scene, camera),
  animate: (renderer, composer, mixer, clock) => animate(renderer, composer, mixer, clock)
}).then()
