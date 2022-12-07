import * as THREE from 'three'
import { initScene } from '../../bootstrap/bootstrap'
import { intializeRendererControls } from '../../controls/renderer-control'

import GUI from 'lil-gui'
import { initializeGuiMeshBasicMaterial } from '../../controls/material-controls'
import { initializeSceneControls } from '../../controls/scene-controls'
import { sampleCube } from '../../models/models'

const props = {
  backgroundColor: 0xffffff
}

const gui = new GUI()

const init = async () => {
  const mat1 = new THREE.MeshBasicMaterial({ color: 0x777777 })
  const mat2 = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  const mat3 = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const mat4 = new THREE.MeshBasicMaterial({ color: 0x0000ff })
  const mat5 = new THREE.MeshBasicMaterial({ color: 0x66aaff })
  const mat6 = new THREE.MeshBasicMaterial({ color: 0xffaa66 })

  const group = new THREE.Group()
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        const cubeMesh = sampleCube([mat1, mat2, mat3, mat4, mat5, mat6], 0.95)
        cubeMesh.position.set(x - 1.5, y - 1.5, z - 1.5)
        group.add(cubeMesh)
      }
    }
  }

  initScene(props)(({ scene, camera, renderer, orbitControls }) => {
    camera.position.x = -3
    camera.position.z = 8
    camera.position.y = 2
    orbitControls.update()

    function animate() {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
      orbitControls.update()
    }

    animate()

    scene.add(group)

    intializeRendererControls(gui, renderer)
    initializeSceneControls(gui, scene, false)
    initializeGuiMeshBasicMaterial(gui, group, mat1, 'mat1')
    initializeGuiMeshBasicMaterial(gui, group, mat2, 'mat2')
    initializeGuiMeshBasicMaterial(gui, group, mat3, 'mat3')
    initializeGuiMeshBasicMaterial(gui, group, mat4, 'mat4')
    initializeGuiMeshBasicMaterial(gui, group, mat5, 'mat5')
    initializeGuiMeshBasicMaterial(gui, group, mat6, 'mat6')
  })
}

init().then()
