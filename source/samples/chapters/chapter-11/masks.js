import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { MaskPass, ClearMaskPass } from 'three/examples/jsm/postprocessing/MaskPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { SepiaShader } from 'three/examples/jsm/shaders/SepiaShader'
import { ColorifyShader } from 'three/examples/jsm/shaders/ColorifyShader'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'

const addEarth = (scene) => {
  var textureLoader = new THREE.TextureLoader()
  var planetMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load('/assets/textures/earth/Earth.png'),
    normalMap: textureLoader.load('/assets/textures/earth/EarthNormal.png'),
    specularMap: textureLoader.load('/assets/textures/earth/EarthSpec.png'),
    specular: new THREE.Color(0x4444aa),
    normalScale: new THREE.Vector2(6, 6),
    shininess: 0.5
  })

  var earth = new THREE.Mesh(new THREE.SphereGeometry(15, 40, 40), planetMaterial)
  scene.add(earth)
  var pivot = new THREE.Object3D()
  initDefaultLighting(pivot)
  scene.add(pivot)

  return { earth: earth, pivot: pivot }
}

const addMars = (scene) => {
  var textureLoader = new THREE.TextureLoader()
  var planetMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load('/assets/textures/mars/mars_1k_color.jpg'),
    normalMap: textureLoader.load('/assets/textures/mars/mars_1k_normal.jpg'),
    normalScale: new THREE.Vector2(6, 6),
    shininess: 0.5
  })

  var mars = new THREE.Mesh(new THREE.SphereGeometry(15, 40, 40), planetMaterial)
  scene.add(mars)
  var pivot = new THREE.Object3D()
  initDefaultLighting(pivot)
  scene.add(pivot)

  return { mars: mars, pivot: pivot }
}

const initDefaultLighting = (scene, initialPosition) => {
  var position = initialPosition !== undefined ? initialPosition : new THREE.Vector3(-10, 30, 40)
  var spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.copy(position)
  spotLight.shadow.mapSize.width = 2048
  spotLight.shadow.mapSize.height = 2048
  spotLight.shadow.camera.fov = 15
  spotLight.castShadow = true
  spotLight.decay = 2
  spotLight.penumbra = 0.05
  spotLight.name = 'spotLight'

  scene.add(spotLight)

  var ambientLight = new THREE.AmbientLight(0x343434)
  ambientLight.name = 'ambientLight'
  scene.add(ambientLight)
}

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.copy(new THREE.Vector3(0, 20, 40))
camera.lookAt(new THREE.Vector3(0, 0, 0))

// create all the scenes we'll be rendering.
const sceneEarth = new THREE.Scene()
const sceneMars = new THREE.Scene()
const sceneBG = new THREE.Scene()

sceneBG.background = new THREE.TextureLoader().load('/assets/textures/bg/starry-deep-outer-space-galaxy.jpg')
const earthAndLight = addEarth(sceneEarth)
sceneEarth.translateX(-16)
sceneEarth.scale.set(1.2, 1.2, 1.2)
const marsAndLight = addMars(sceneMars)
sceneMars.translateX(12)
sceneMars.translateY(6)
sceneMars.scale.set(0.2, 0.2, 0.2)

// setup passes. First the main renderpasses. Note that
// only the bgRenderpass clears the screen.
const bgRenderPass = new RenderPass(sceneBG, camera)
const earthRenderPass = new RenderPass(sceneEarth, camera)
earthRenderPass.clear = false
const marsRenderPass = new RenderPass(sceneMars, camera)
marsRenderPass.clear = false

// setup the mask
const clearMask = new ClearMaskPass()
const marsMask = new MaskPass(sceneMars, camera)
const earthMask = new MaskPass(sceneEarth, camera)

// setup some effects to apply
const effectSepia = new ShaderPass(SepiaShader)
effectSepia.uniforms['amount'].value = 0.8
const effectColorify = new ShaderPass(ColorifyShader)
effectColorify.uniforms['color'].value.setRGB(0.5, 0.5, 1)

const effectCopy = new ShaderPass(CopyShader)
effectCopy.renderToScreen = true

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setClearColor(new THREE.Color(0x000000), 0)
renderer.autoClear = false
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

var composer = new EffectComposer(renderer)
composer.renderTarget1.stencilBuffer = true
composer.renderTarget2.stencilBuffer = true
composer.addPass(bgRenderPass)
composer.addPass(earthRenderPass)
composer.addPass(marsRenderPass)
composer.addPass(marsMask)
composer.addPass(effectColorify)
composer.addPass(clearMask)
composer.addPass(earthMask)
composer.addPass(effectSepia)
composer.addPass(clearMask)
composer.addPass(effectCopy)

const render = () => {
  earthAndLight.earth.rotation.y += 0.001
  earthAndLight.pivot.rotation.y += -0.0003
  marsAndLight.mars.rotation.y += -0.001
  marsAndLight.pivot.rotation.y += +0.0003

  // request next and render using composer
  requestAnimationFrame(render)
  renderer.clear()
  composer.render()
}

render()
