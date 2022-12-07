import { initScene } from '../../../bootstrap/bootstrap'
import { intializeRendererControls } from '../../../controls/renderer-control'

import GUI from 'lil-gui'
import { initializeSceneControls } from '../../../controls/scene-controls'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { visitChildren } from '../../../util/modelUtil'

export const bootstrapMeshScene = async ({ provideGui, backgroundColor, addControls, initializeComposer, animate }) => {
  const props = {
    backgroundColor: backgroundColor ?? 0xffffff,
    disableDefaultControls: true
  }

  const loader = new GLTFLoader()
  const mesh = await loader.loadAsync('/assets/models/sea_house/scene.gltf').then((structure) => {
    structure.scene.scale.setScalar(0.03, 0.03, 0.03)
    visitChildren(structure.scene, (child) => {
      if (child.material) {
        child.material.depthWrite = true
      }
    })
    return structure.scene
  })

  const gui = new GUI()

  const init = async () => {
    initScene(props)(({ scene, camera, renderer }) => {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      camera.position.x = -3
      camera.position.z = 8
      camera.position.y = 4

      if (mesh) scene.add(mesh)

      intializeRendererControls(gui, renderer)
      initializeSceneControls(gui, scene, false)

      const composer = initializeComposer(renderer, scene, camera, mesh)

      if (provideGui) provideGui(gui, mesh, scene)
      let controls = undefined
      if (addControls) {
        controls = addControls(camera, renderer, scene, gui, mesh)
      }

      animate(renderer, composer)
    })
  }

  init().then()
}
