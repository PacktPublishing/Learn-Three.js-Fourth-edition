import { initScene } from '../../../bootstrap/bootstrap'
import { intializeRendererControls } from '../../../controls/renderer-control'

import GUI from 'lil-gui'
import { initializeSceneControls } from '../../../controls/scene-controls'
import * as THREE from 'three'
import { floatingFloor } from '../../../bootstrap/floor'

export const bootstrapMeshScene = async ({
  provideGui,
  backgroundColor,
  addControls,
  initializeComposer,
  animate,
  initializeScene
}) => {
  const props = {
    backgroundColor: backgroundColor ?? 0xffffff,
    disableDefaultControls: true
  }

  const gui = new GUI()

  const init = async () => {
    initScene(props)(({ scene, camera, renderer }) => {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      camera.position.x = -3
      camera.position.z = 8
      camera.position.y = 2

      if (initializeScene) initializeScene(scene)
      intializeRendererControls(gui, renderer)
      initializeSceneControls(gui, scene, false)

      let composer
      if (initializeComposer) {
        composer = initializeComposer(renderer, scene, camera)
      }

      if (provideGui) provideGui(gui)
      if (addControls) {
        addControls(camera, renderer, scene, gui)
      }

      animate(renderer, composer)
    })
  }

  init().then()
}
