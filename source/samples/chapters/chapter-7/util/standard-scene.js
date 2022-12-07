import { initScene } from '../../../bootstrap/bootstrap'
import { intializeRendererControls } from '../../../controls/renderer-control'

import GUI from 'lil-gui'
import { initializeSceneControls } from '../../../controls/scene-controls'
import * as THREE from 'three'
import {
  initializeGuiMaterial,
  initializePointsMaterial,
  initializeSpriteMaterial
} from '../../../controls/material-controls'

export const bootstrapGeometryScene = async ({
  geometry,
  provideGui,
  material,
  isSprite,
  spritePosition,
  onRender,
  provideMesh,
  backgroundColor
}) => {
  const props = {
    backgroundColor: backgroundColor ?? 0xffffff,
    fogColor: 0xffffff
  }

  const gui = new GUI()
  const points = provideMesh
    ? provideMesh(geometry)
    : isSprite
    ? new THREE.Sprite(material)
    : new THREE.Points(geometry, material)

  if (spritePosition) points.position.copy(spritePosition)

  const init = async () => {
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
        if (onRender) onRender(points)
      }

      animate()

      scene.add(points)
      intializeRendererControls(gui, renderer)
      initializeSceneControls(gui, scene, false)
      if (material) initializeGuiMaterial(gui, scene, material)
      if (material)
        isSprite ? initializeSpriteMaterial(gui, scene, material) : initializePointsMaterial(gui, scene, material)
      provideGui(gui, points, scene)
    })
  }

  init().then()
}
