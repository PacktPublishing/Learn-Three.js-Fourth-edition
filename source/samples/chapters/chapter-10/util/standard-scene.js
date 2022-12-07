import { initScene } from '../../../bootstrap/bootstrap'
import { intializeRendererControls } from '../../../controls/renderer-control'

import GUI, { Controller } from 'lil-gui'
import { initializeGuiMaterial } from '../../../controls/material-controls'
import { initializeSceneControls } from '../../../controls/scene-controls'
import {
  sampleFox,
  sampleKnot,
  sampleSphere,
  sampleMaterialBall,
  sampleVertexColors,
  sampleCube
} from '../../../models/models'
import { initializeModelSelectControls } from '../../../controls/model-select-control'
import { sampleGosper } from '../../../models/models'
import * as THREE from 'three'
import { initOrbitControls } from '../../../controller/orbit-controller'

export const bootstrapMaterialScene = async ({
  material,
  withMaterialGui,
  provideGui,
  applyTextures,
  onRender,
  onModelChanged
}) => {
  const props = {
    backgroundColor: 0xffffff
  }

  const gui = new GUI()

  const init = async () => {
    const floatingSphereMesh = sampleSphere(material)
    floatingSphereMesh.name = 'mesh'
    const sampleBox = sampleCube(material, 1)
    const foxMesh = await sampleFox(material)
    const materialBallMesh = await sampleMaterialBall(material)
    const sampleVertexColorsMesh = await sampleVertexColors(material)
    const knotMesh = sampleKnot(material)
    const gosperMesh = sampleGosper(material)

    if (onModelChanged) onModelChanged(floatingSphereMesh)

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
        if (onRender) {
          onRender(scene)
        }
      }

      animate()

      scene.add(floatingSphereMesh)

      intializeRendererControls(gui, renderer)
      initializeSceneControls(gui, scene, false)
      initializeModelSelectControls(
        gui,
        {
          sphere: floatingSphereMesh,
          sampleBox: sampleBox,
          fox: foxMesh,
          knot: knotMesh,
          materialBall: materialBallMesh,
          vertexColors: sampleVertexColorsMesh,
          gosperMesh: gosperMesh
        },
        (selected) => {
          scene.remove(floatingSphereMesh)
          scene.remove(foxMesh)
          scene.remove(knotMesh)
          scene.remove(materialBallMesh)
          scene.remove(sampleVertexColorsMesh)
          scene.remove(gosperMesh)
          scene.remove(sampleBox)
          scene.add(selected)
          selected.name = 'mesh'

          onModelChanged(selected)

          if (withMaterialGui) initializeGuiMaterial(gui, selected, material)
          provideGui(gui, selected, material, scene, renderer)
        }
      )
      if (withMaterialGui) initializeGuiMaterial(gui, floatingSphereMesh, material)
      provideGui(gui, floatingSphereMesh, material, scene, renderer)
    })
  }

  init().then()
}
