import * as THREE from 'three'
import { initScene } from '../../bootstrap/bootstrap'
import { intializeRendererControls } from '../../controls/renderer-control'

import GUI from 'lil-gui'

import fs_simple from './glsl/fs-simple-basic.glsl'
import vs_simple from './glsl/vs-simple-basic.glsl'
import fs_night_sky from './glsl/fs-night-sky-basic.glsl'
import vs_noop from './glsl/vs-noop.glsl'
import fs_color_shift from './glsl/fs-color-shift-basic.glsl'
import vs_ripple from './glsl/vs-simple-ripple-basic.glsl'

import { getObjectsKeys } from '../../util'

const props = {
  backgroundColor: 0xffffff,
  fogColor: 0xffffff
}
const gui = new GUI()

const getVertexShaderPlane = () => {
  const geometry = new THREE.PlaneGeometry(10, 10, 100, 100)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() } // TODO: we should add a value here
    },
    vertexShader: vs_simple,
    fragmentShader: fs_simple
  })

  return { geometry, material }
}

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
  camera.position.set(-3, 8, 2)
  camera.near = 4
  camera.far = 20

  camera.updateProjectionMatrix()
  orbitControls.update()

  const props = {
    vertexShader: 'vs_simple',
    fragmentShader: 'fs_simple',
    timeIncrement: 0.005
  }

  const { geometry, material } = getVertexShaderPlane()

  const shaderFolder = gui.addFolder('Shaders')
  const vertexShaders = { vs_simple: vs_simple, vs_noop: vs_noop, vs_ripple: vs_ripple }
  const fragmentShaders = { fs_simple: fs_simple, fs_night_sky: fs_night_sky, fs_color_shift: fs_color_shift }

  shaderFolder.add(props, 'fragmentShader', getObjectsKeys(fragmentShaders)).onChange((changed) => {
    material.fragmentShader = fragmentShaders[changed]
    material.needsUpdate = true
  })
  shaderFolder.add(props, 'vertexShader', getObjectsKeys(vertexShaders)).onChange((changed) => {
    material.vertexShader = vertexShaders[changed]
    material.needsUpdate = true
  })
  shaderFolder.add(props, 'timeIncrement', -0.01, 0.01, 0.001)

  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    orbitControls.update()
    material.uniforms.time.value += props.timeIncrement
  }
  animate()

  intializeRendererControls(gui, renderer)
})
