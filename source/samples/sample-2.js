import * as THREE from 'three'
import GUI from 'lil-gui'
import { initScene } from './bootstrap/bootstrap'

initScene(({ scene, camera, renderer }) => {
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
})
