import * as THREE from 'three'
import { initScene } from './bootstrap/bootstrap'
import { floatingFloor } from './bootstrap/floor'
import { intializeRendererControls } from './controls/renderer-control'
import { initializeHelperControls } from './controls/helpers-control'
import GUI from 'lil-gui'

const props = {
  backgroundColor: 0xffffff,
  // fogColor: 0xfff6bc
  fogColor: 0xffffff
}

// const props = {
//   backgroundColor: 0x111111,
//   // fogColor: 0xfff6bc
//   fogColor: 0xffffff
// }

const gui = new GUI()

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
  const geometry = new THREE.BoxGeometry()
  const material2 = new THREE.MeshPhongMaterial({
    color: 0xff0000
  })
  const cube = new THREE.Mesh(geometry, material2)
  cube.position.x = -1
  cube.castShadow = true
  scene.add(cube)

  const torusKnotGeom = new THREE.TorusKnotBufferGeometry(0.5, 0.2, 100, 100)
  const torusKnotMat = new THREE.MeshStandardMaterial({
    color: 0x00ff88,
    roughness: 0.1
  }
  )
  const torusKnotMesh = new THREE.Mesh(torusKnotGeom, torusKnotMat)
  torusKnotMesh.castShadow = true
  torusKnotMesh.position.x = 2
  scene.add(torusKnotMesh)

  camera.position.x = -3
  camera.position.z = 8
  camera.position.y = 2
  orbitControls.update()

  floatingFloor(scene)

  function animate () {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    cube.rotation.z += 0.01

    torusKnotMesh.rotation.x -= 0.01
    torusKnotMesh.rotation.y += 0.01
    torusKnotMesh.rotation.z -= 0.01

    orbitControls.update()
  }
  animate()

  intializeRendererControls(gui, renderer)
  initializeHelperControls(gui, scene)
})
