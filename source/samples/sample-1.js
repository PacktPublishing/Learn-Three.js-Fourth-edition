import * as THREE from 'three'
import { onResize } from './util/update-on-resize'
import { checkWebGL } from './util/webgl-check'
import GUI from 'lil-gui'

checkWebGL()

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
onResize(camera, renderer)

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry()
const material2 = new THREE.MeshNormalMaterial()
const cube = new THREE.Mesh(geometry, material2)
scene.add(cube)

camera.position.z = 5

function animate () {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.03
}
animate()
setupGUI()

function setupGUI () {
  const gui = new GUI()

  const myObject = {
    myBoolean: true,
    myString: 'lil-gui',
    myNumber: 1
  }

  gui.add(myObject, 'myBoolean') // Checkbox
  gui.add(myObject, 'myString') // Text Field
  gui.add(myObject, 'myNumber') // Number Field
}
