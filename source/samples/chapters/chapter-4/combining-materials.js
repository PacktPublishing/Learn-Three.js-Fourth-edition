import * as THREE from 'three'
import { initScene } from '../../bootstrap/bootstrap'
import { intializeRendererControls } from '../../controls/renderer-control'

import GUI from 'lil-gui'
import { initializeAddRemoveCubeControls } from '../../controls/add-remove-cube-controls'
import {
  initializeGuiMaterial,
  initializeGuiMeshBasicMaterial,
  initializeMeshDepthMaterial
} from '../../controls/material-controls'
import { initializePerspectiveCameraControls } from '../../controls/camera-controls'
import { initializeSceneControls } from '../../controls/scene-controls'

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

  const material1 = new THREE.MeshDepthMaterial()
  const material2 = new THREE.MeshBasicMaterial({ color: 0xffff00 })
  const material = [material2, material1]
  const group = new THREE.Group()
  scene.add(group)

  intializeRendererControls(gui, renderer)
  initializePerspectiveCameraControls(camera, gui, orbitControls)
  initializeSceneControls(gui, scene, false, false)
  initializeAddRemoveCubeControls(gui, group, material)
  initializeGuiMaterial(gui, group, material2)
  initializeGuiMeshBasicMaterial(gui, group, material2)
  initializeMeshDepthMaterial(gui, group, material1)
})
