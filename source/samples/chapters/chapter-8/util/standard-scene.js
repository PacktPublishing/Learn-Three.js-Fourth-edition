import { initScene } from '../../../bootstrap/bootstrap'
import { intializeRendererControls } from '../../../controls/renderer-control'

import GUI from 'lil-gui'
import { initializeSceneControls } from '../../../controls/scene-controls'
import * as THREE from 'three'
import { floatingFloor } from '../../../bootstrap/floor'
import { visitChildren } from '../../../util/modelUtil'

export const bootstrapMeshScene = async ({
  loadMesh,
  provideGui,
  hidefloor,
  floorSize,
  backgroundColor,
  onRender,
  disableLights
}) => {
  const props = {
    backgroundColor: backgroundColor ?? 0xffffff,
    disableLights: disableLights ?? false
  }

  const mesh = await loadMesh()

  const gui = new GUI()

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
        if (onRender) onRender()
      }

      if (!disableLights) {
        const extraLight = new THREE.DirectionalLight()
        extraLight.position.set(-5, 1, 0)
        extraLight.intensity = 0.2
        scene.add(extraLight)
      }

      animate()
      hidefloor ?? floatingFloor(scene, floorSize ?? 8)

      if (mesh) scene.add(mesh)

      intializeRendererControls(gui, renderer)
      initializeSceneControls(gui, scene, false)

      if (provideGui) provideGui(gui, mesh, scene)
    })
  }

  init().then()
}
