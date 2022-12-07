import * as THREE from 'three'
import { initScene } from '../../bootstrap/bootstrap'
import { intializeRendererControls } from '../../controls/renderer-control'

import GUI from 'lil-gui'
import { initializeAddRemoveCubeControls } from '../../controls/add-remove-cube-controls'
import { initializeGuiMaterial, initializeMeshDepthMaterial } from '../../controls/material-controls'
import { initializePerspectiveCameraControls } from '../../controls/camera-controls'

const props = {
  backgroundColor: 0xffffff,
  fogColor: 0xffffff
}

const gui = new GUI()

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
  camera.position.set(-3, 8, 2)
  camera.near = 4
  camera.far = 20

  camera.updateProjectionMatrix()
  orbitControls.update()

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    orbitControls.update()
  }
  animate()

  const material = new THREE.MeshDepthMaterial()
  const group = new THREE.Group()
  scene.add(group)

  intializeRendererControls(gui, renderer)
  initializePerspectiveCameraControls(camera, gui, orbitControls)
  initializeAddRemoveCubeControls(gui, group, material)
  initializeGuiMaterial(gui, group, material)
  initializeMeshDepthMaterial(gui, group, material)
})
