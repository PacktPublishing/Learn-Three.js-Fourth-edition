import GUI from 'lil-gui'
import { floatingFloor } from '../../bootstrap/floor.js'
import { initializeAddRemoveCubeControls } from '../../controls/add-remove-cube-controls.js'
import { initializeHelperControls } from '../../controls/helpers-control.js'
import { initializeSceneControls } from '../../controls/scene-controls'
import { initScene } from '../../bootstrap/bootstrap.js'
import { intializeRendererControls } from '../../controls/renderer-control.js'
import { stats } from '../../util/stats'

const props = {
  backgroundColor: 0xffffff,
  fogColor: 0xffffff
}
const gui = new GUI()

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
  camera.position.set(-7, 2, 5)
  orbitControls.update()

  floatingFloor(scene, 10)

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    stats.update()

    orbitControls.update()
  }
  animate()

  intializeRendererControls(gui, renderer)
  initializeHelperControls(gui, scene)
  initializeSceneControls(gui, scene, true)
  initializeAddRemoveCubeControls(gui, scene)
})
