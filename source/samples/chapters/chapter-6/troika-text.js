// npm install troika-three-text
import { Text } from 'troika-three-text'
import * as THREE from 'three'
import { initScene } from '../../bootstrap/bootstrap'
import { intializeRendererControls } from '../../controls/renderer-control'

import GUI from 'lil-gui'
import { initializeSceneControls } from '../../controls/scene-controls'

const props = {
  backgroundColor: 0xffffff,
  fogColor: 0xffffff
}

const gui = new GUI()

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
  camera.position.set(-3, 8, 2)
  camera.near = 1
  camera.far = 100

  camera.updateProjectionMatrix()
  orbitControls.update()

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    orbitControls.update()
  }
  animate()

  const troikaText = new Text()
  scene.add(troikaText)

  // Set properties to configure:
  troikaText.text = 'Text rendering with Troika!\nGreat for 2D labels'
  troikaText.fontSize = 2
  troikaText.position.x = -3

  troikaText.color = 0xff00ff

  // Update the rendering:
  troikaText.sync()

  intializeRendererControls(gui, renderer)
  initializeSceneControls(gui, scene, false, false)
})
