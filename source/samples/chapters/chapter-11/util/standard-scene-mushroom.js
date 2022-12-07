import { initScene } from '../../../bootstrap/bootstrap'
import { intializeRendererControls } from '../../../controls/renderer-control'

import GUI from 'lil-gui'
import { initializeSceneControls } from '../../../controls/scene-controls'
import * as THREE from 'three'
import { floatingFloor } from '../../../bootstrap/floor'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { applyShadowsAndDepthWrite } from '../../../util/modelUtil'
import { initializeAnimationControls } from '../../../controls/animation-controls'

export const bootstrapMeshScene = async ({
  provideGui,
  hidefloor,
  floorSize,
  backgroundColor,
  onRender,
  addControls,
  initializeComposer,
  animate
}) => {
  const props = {
    backgroundColor: backgroundColor ?? 0xffffff,
    disableDefaultControls: true
  }

  const clock = new THREE.Clock()
  const loader = new GLTFLoader()
  const mesh = await loader.loadAsync('/assets/models/truffle_man/scene.gltf').then((container) => {
    container.scene.scale.setScalar(4)
    container.scene.translateY(-2)
    applyShadowsAndDepthWrite(container.scene)
    container.scene.name = 'mushroom-man'
    return container.scene
  })

  const gui = new GUI()

  const init = async () => {
    initScene(props)(({ scene, camera, renderer }) => {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      camera.position.x = -3
      camera.position.z = 8
      camera.position.y = 2

      hidefloor ?? floatingFloor(scene, floorSize ?? 8)

      if (mesh) scene.add(mesh)

      intializeRendererControls(gui, renderer)
      initializeSceneControls(gui, scene, false)

      const composer = initializeComposer(renderer, scene, camera, mesh)

      if (provideGui) provideGui(gui, mesh, scene)
      if (addControls) {
        addControls(camera, renderer, scene, gui, mesh)
      }

      animate(renderer, composer, clock)
    })
  }

  init().then()
}
