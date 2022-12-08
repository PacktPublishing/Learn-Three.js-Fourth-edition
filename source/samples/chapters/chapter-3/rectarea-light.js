import * as THREE from 'three'
import GUI from 'lil-gui'
import { floatingFloor } from '../../bootstrap/floor.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { initScene } from '../../bootstrap/bootstrap.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import { stats } from '../../util/stats'
import { visitChildren } from '../../util/modelUtil.js'

const props = {
  backgroundColor: 0xcccccc,
  disableLights: true
}
const gui = new GUI()

const loadIsland = (scene) => {
  const loader = new GLTFLoader()
  loader.load('/assets/gltf/flying_island/scene.gltf', (loadedObject) => {
    // the nested
    const loadedScene = loadedObject.scene.children[0].children[0].children[0]
    visitChildren(loadedScene, (c) => {
      c.receiveShadow = true
      c.castShadow = true
    })
    loadedScene.scale.set(0.012, 0.012, 0.012)
    loadedScene.translateY(-3)
    scene.add(loadedScene)
  })
}

// TODO: Add the rotation and position controls here, that we've
//       seen earlier, to allow us to move the lights around.
initScene(props)(({ scene, camera, renderer, orbitControls }) => {
  camera.position.set(2, 7, -7)
  orbitControls.update()
  const floor = floatingFloor(scene, 10)
  floor.material.metalness = 0.2
  floor.material.roughness = 0.1

  const colorHolder = new THREE.Color(0x666666)
  const light = new THREE.AmbientLight(colorHolder, 1)
  scene.add(light)

  loadIsland(scene)

  RectAreaLightUniformsLib.init()

  const rectLight1 = new THREE.RectAreaLight(0xff0000, 5, 2, 5)
  const color1Holder = { color: rectLight1.color.getStyle() }
  rectLight1.position.set(-3, 0, 5)
  scene.add(rectLight1)

  const rectLight2 = new THREE.RectAreaLight(0x00ff00, 5, 2, 5)
  const color2Holder = { color: rectLight2.color.getStyle() }
  rectLight2.position.set(0, 0, 5)
  scene.add(rectLight2)

  const rectLight3 = new THREE.RectAreaLight(0x0000ff, 5, 2, 5)
  const color3Holder = { color: rectLight3.color.getStyle() }
  rectLight3.position.set(3, 0, 5)
  scene.add(rectLight3)

  scene.add(new RectAreaLightHelper(rectLight1))
  scene.add(new RectAreaLightHelper(rectLight2))
  scene.add(new RectAreaLightHelper(rectLight3))

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    stats.update()

    orbitControls.update()
  }

  setupRectGui(color1Holder, rectLight1, 'rect-light-1')
  setupRectGui(color2Holder, rectLight2, 'rect-light-2')
  setupRectGui(color3Holder, rectLight3, 'rect-light-3')
  animate()
})

function setupRectGui(colorHolder, light, folderName) {
  const rectAreaFolder = gui.addFolder(folderName)
  rectAreaFolder.addColor(colorHolder, 'color').onChange((c) => light.color.setStyle(c))
  rectAreaFolder.add(light, 'intensity', 0, 15, 0.1)
  rectAreaFolder.add(light, 'decay', 0, 5, 0.01)
  rectAreaFolder.add(light, 'width', 0, 20, 0.01)
  rectAreaFolder.add(light, 'height', 0, 20, 0.01)
  rectAreaFolder.add(light.position, 'x', -30, 30, 0.1).name('positionX')
  rectAreaFolder.add(light.position, 'y', -30, 30, 0.1).name('positionY')
  rectAreaFolder.add(light.position, 'z', -30, 30, 0.1).name('positionZ')
  rectAreaFolder.add(light.rotation, 'x', -2 * Math.PI, 2 * Math.PI, 0.1).name('rotationX')
  rectAreaFolder.add(light.rotation, 'y', -2 * Math.PI, 2 * Math.PI, 0.1).name('rotationY')
  rectAreaFolder.add(light.rotation, 'z', -2 * Math.PI, 2 * Math.PI, 0.1).name('rotationZ')
}
