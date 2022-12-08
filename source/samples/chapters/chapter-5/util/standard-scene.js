import { initScene } from '../../../bootstrap/bootstrap'
import { intializeRendererControls } from '../../../controls/renderer-control'

import GUI from 'lil-gui'
import { initializeGuiMaterial, initializeGuiMeshStandardMaterial } from '../../../controls/material-controls'
import { initializeSceneControls } from '../../../controls/scene-controls'
import * as THREE from 'three'
import { foreverPlane } from '../../../bootstrap/floor'
import { initializeMeshVisibleControls } from '../../../controls/mesh-visible-controls'

export const bootstrapGeometryScene = async ({ geometry, provideGui, hidefloor }) => {
  const props = {
    backgroundColor: 0xffffff,
    fogColor: 0xffffff
  }

  const gui = new GUI()

  const init = async () => {
    const material = new THREE.MeshStandardMaterial({
      color: 0xffaa88
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    initScene(props)(({ scene, camera, renderer, orbitControls }) => {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
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

      const plane = hidefloor ?? foreverPlane(scene)
      scene.add(mesh)
      intializeRendererControls(gui, renderer)
      initializeSceneControls(gui, scene, false)

      initializeGuiMaterial(gui, mesh, material).close()
      initializeGuiMeshStandardMaterial(gui, mesh, material).close()
      hidefloor ?? initializeMeshVisibleControls(gui, plane, 'Floor')
      provideGui(gui, mesh)
    })
  }

  init().then()
}
