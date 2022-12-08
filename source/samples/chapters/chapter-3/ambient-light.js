import * as THREE from 'three'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { initializeAmbientLightControls } from '../../controls/lights-controls.js'
import { initScene } from '../../bootstrap/bootstrap.js'
import { stats } from '../../util/stats'

const props = {
  backgroundColor: 0xcccccc,
  disableLights: true
}
const gui = new GUI()

const loadWaterfall = (scene) => {
  const loader = new GLTFLoader()
  loader.load('/assets/gltf/waterfall/scene.gltf', (loadedObject) => {
    const loadedScene = loadedObject.scene.children[0].children[0].children[0]
    loadedScene.rotateX(-Math.PI / 2)
    console.log(loadedScene)
    scene.add(loadedScene)
  })
}

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
  camera.position.set(-7, 2, 5)
  orbitControls.update()

  loadWaterfall(scene)

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    stats.update()

    orbitControls.update()
  }

  const colorHolder = new THREE.Color(0xffffff)
  const light = new THREE.AmbientLight(colorHolder, 1)
  scene.add(light)

  initializeAmbientLightControls(gui, light)

  animate()
})
