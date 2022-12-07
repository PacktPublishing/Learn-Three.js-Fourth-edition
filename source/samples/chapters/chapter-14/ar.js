import * as THREE from 'three'
import { ARButton } from 'three/examples/jsm/webxr/ARButton'

// basic scene setup
const scene = new THREE.Scene()
// setup camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// setup the renderer and attach to canvas
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.xr.enabled = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.VSMShadowMap
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.xr.enabled = true
document.body.appendChild(renderer.domElement)

scene.add(new THREE.AmbientLight(0x666666))
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

// create a cube and torus knot and add them to the scene
const cubeGeometry = new THREE.BoxGeometry()
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff })
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

cube.position.z = -3
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
torusKnotMesh.position.z = -3

scene.add(torusKnotMesh)

// add stats
document.body.appendChild(ARButton.createButton(renderer))

animate()

// render the scene
function animate() {
  torusKnotMesh.rotation.x += 0.002
  torusKnotMesh.rotation.y += 0.002
  cube.rotation.x += 0.002
  cube.rotation.y += 0.002
  renderer.setAnimationLoop(animate)
  renderer.render(scene, camera)
}
