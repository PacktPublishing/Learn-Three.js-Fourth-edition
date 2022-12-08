import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import GUI from 'lil-gui'

// Note: This is just a getting started example. For the other examples
// we reuse the basic components by extracting them to a set of common
// JavaScript modules / files.
const createSprite = (size, transparent, opacity, spriteNumber) => {
  const spriteMaterial = new THREE.SpriteMaterial({
    opacity: opacity,
    color: 0xffffff,
    transparent: transparent,
    map: getTexture()
  })

  // we have 1 row, with five sprites
  spriteMaterial.map.offset = new THREE.Vector2(0.2 * spriteNumber, 0)
  spriteMaterial.map.repeat = new THREE.Vector2(1 / 5, 1)
  // make sure the object is always rendered at the front
  spriteMaterial.depthTest = false

  const sprite = new THREE.Sprite(spriteMaterial)
  sprite.scale.set(size, size, size)
  sprite.position.set(100, 50, -10)
  sprite.velocityX = 5
  sprite.name = 'Sprite'

  sceneOrtho.add(sprite)
}

const getTexture = () => {
  const texture = new THREE.TextureLoader().load('/assets/textures/particles/sprite-sheet.png')
  return texture
}

// we use two scenes
const scene = new THREE.Scene()
scene.backgroundColor = 0xffffff
scene.fog = new THREE.Fog(0xffffff, 0.0025, 50)

const sceneOrtho = new THREE.Scene()
sceneOrtho.backgroundColor = new THREE.Color(0x000000)

// and two cameras
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(-3, 2, 8)

const cameraOrtho = new THREE.OrthographicCamera(0, window.innerWidth, window.innerHeight, 0, -10, 10)

// setup the renderer and attach to canvas
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.VSMShadowMap
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xffffff)
document.body.appendChild(renderer.domElement)

// add a
const dirLight = new THREE.DirectionalLight(0xaaaaaa)
dirLight.position.set(5, 12, 8)
dirLight.castShadow = true
dirLight.intensity = 1
dirLight.shadow.camera.near = 0.1
dirLight.shadow.camera.far = 200
dirLight.shadow.camera.right = 10
dirLight.shadow.camera.left = -10
dirLight.shadow.camera.top = 10
dirLight.shadow.camera.bottom = -10
dirLight.shadow.mapSize.width = 512
dirLight.shadow.mapSize.height = 512
dirLight.shadow.radius = 4
dirLight.shadow.bias = -0.0005
scene.add(dirLight)

// add orbitcontrols
const controller = new OrbitControls(camera, renderer.domElement)
controller.enableDamping = true
controller.dampingFactor = 0.05
controller.minDistance = 3
controller.maxDistance = 10
controller.minPolarAngle = Math.PI / 4
controller.maxPolarAngle = (3 * Math.PI) / 4

// create a cube and torus knot and add them to the scene
const cubeGeometry = new THREE.BoxGeometry()
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff })
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

cube.position.x = -1
cube.castShadow = true
scene.add(cube)

const torusKnotGeometry = new THREE.TorusKnotBufferGeometry(0.5, 0.2, 100, 100)
const torusKnotMat = new THREE.MeshStandardMaterial({
  color: 0x00ff88,
  roughness: 0.1
})
const torusKnotMesh = new THREE.Mesh(torusKnotGeometry, torusKnotMat)

torusKnotMesh.castShadow = true
torusKnotMesh.position.x = 2
scene.add(torusKnotMesh)

// create a very large ground plane
const groundGeometry = new THREE.PlaneBufferGeometry(10000, 10000)
const groundMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff
})
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
groundMesh.position.set(0, -2, 0)
groundMesh.rotation.set(Math.PI / -2, 0, 0)
groundMesh.receiveShadow = true
scene.add(groundMesh)

// add stats
const stats = Stats()
document.body.appendChild(stats.dom)

// add gui
const gui = new GUI()
const props = {
  cubeSpeed: 0.01,
  torusSpeed: 0.01,
  size: 200,
  sprite: 1,
  transparent: true,
  opacity: 0.6,
  redraw: () => {
    const sprite = sceneOrtho.getObjectByName('Sprite')
    if (sprite) sceneOrtho.remove(sprite)
    createSprite(props.size, props.transparent, props.opacity, props.sprite)
  }
}

gui.add(props, 'cubeSpeed', -0.2, 0.2, 0.01)
gui.add(props, 'torusSpeed', -0.2, 0.2, 0.01)
gui.add(props, 'sprite', 0, 4, 1).onChange(props.redraw)
gui.add(props, 'size', 0, 120, 1).onChange(props.redraw)
gui.add(props, 'transparent').onChange(props.redraw)
gui.add(props, 'opacity', 0, 1, 0.01).onChange(props.redraw)

createSprite(props.size, props.transparent, props.opacity, props.sprite)

renderer.render(scene, camera)

// render the scene
function animate() {
  requestAnimationFrame(animate)

  renderer.render(scene, camera)
  renderer.autoClear = false
  renderer.render(sceneOrtho, cameraOrtho)

  stats.update()
  cube.rotation.x += props.cubeSpeed
  cube.rotation.y += props.cubeSpeed
  cube.rotation.z += props.cubeSpeed

  torusKnotMesh.rotation.x -= props.torusSpeed
  torusKnotMesh.rotation.y += props.torusSpeed
  torusKnotMesh.rotation.z -= props.torusSpeed

  const sprite = sceneOrtho.getObjectByName('Sprite')
  if (sprite) {
    sprite.position.x = sprite.position.x + sprite.velocityX
    if (sprite.position.x > window.innerWidth) {
      sprite.velocityX = -5
      props.sprite += 1
      sprite.material.map.offset.set((1 / 5) * (props.sprite % 4), 0)
    }
    if (sprite.position.x < 0) {
      sprite.velocityX = 5
    }
  }

  controller.update()
}
animate()
