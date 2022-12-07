import * as THREE from 'three'
import { initScene } from '../../bootstrap/bootstrap'
import { intializeRendererControls } from '../../controls/renderer-control'

import GUI from 'lil-gui'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'

import fs_simple from './glsl/fs-simple.glsl'
import vs_simple from './glsl/vs-simple.glsl'
import fs_night_sky from './glsl/fs-night-sky.glsl'
import vs_noop from './glsl/vs-noop.glsl'
import fs_color_shift from './glsl/fs-color-shift.glsl'
import vs_ripple from './glsl/vs-simple-ripple.glsl'

import { getObjectsKeys } from '../../util'
import { initializeSceneControls } from '../../controls/scene-controls'

const props = {
  backgroundColor: 0xffffff,
  fogColor: 0xffffff
}

const gui = new GUI()

const getVertexShaderPlane = (vertexShader, fragmentShader) => {
  const geometry = new THREE.TorusKnotBufferGeometry(2, 0.5, 200, 20)
  const material = new CustomShaderMaterial({
    baseMaterial: THREE.MeshStandardMaterial,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      time: { value: 0.2 },
      resolution: { value: new THREE.Vector2() }
    },
    flatShading: false,
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.9
  })

  return { geometry, material }
}

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
  camera.position.set(-3, 8, 2)
  camera.near = 1
  camera.far = 100

  camera.updateProjectionMatrix()
  orbitControls.update()

  const props = {
    vertexShader: 'vs_simple',
    fragmentShader: 'fs_simple',
    timeIncrement: 0.005
  }

  let { geometry, material } = getVertexShaderPlane(vs_simple, fs_simple)
  let mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true

  const shaderFolder = gui.addFolder('Shaders')
  const vertexShaders = { vs_simple: vs_simple, vs_noop: vs_noop, vs_ripple: vs_ripple }
  const fragmentShaders = { fs_simple: fs_simple, fs_night_sky: fs_night_sky, fs_color_shift: fs_color_shift }

  shaderFolder.add(props, 'fragmentShader', getObjectsKeys(fragmentShaders)).onChange(() => {
    scene.remove(mesh)
    ;({ geometry, material } = getVertexShaderPlane(
      vertexShaders[props.vertexShader],
      fragmentShaders[props.fragmentShader]
    ))
    mesh = new THREE.Mesh(geometry, material)
    mesh.receiveShadow = true
    scene.add(mesh)
  })
  shaderFolder.add(props, 'vertexShader', getObjectsKeys(vertexShaders)).onChange(() => {
    scene.remove(mesh)
    ;({ geometry, material } = getVertexShaderPlane(
      vertexShaders[props.vertexShader],
      fragmentShaders[props.fragmentShader]
    ))
    mesh = new THREE.Mesh(geometry, material)
    mesh.receiveShadow = true
    scene.add(mesh)
  })
  shaderFolder.add(props, 'timeIncrement', -0.01, 0.01, 0.001)

  scene.add(mesh)

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    orbitControls.update()
    material.uniforms.time.value += props.timeIncrement
  }
  animate()

  console.log(material)

  intializeRendererControls(gui, renderer)
  initializeSceneControls(gui, scene, false, false)
})
