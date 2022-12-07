import * as THREE from 'three'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
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
    // the nested
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

  const skyColor = new THREE.Color(0xffffff)
  const groundColor = new THREE.Color(0xffffff)
  const light = new THREE.HemisphereLight(skyColor, groundColor, 1)
  const helper = new THREE.HemisphereLightHelper(light)
  light.position.setY(27)
  scene.add(helper)
  scene.add(light)

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    stats.update()
    helper.update()

    orbitControls.update()
  }

  const props = {
    color: skyColor.getStyle(),
    groundColor: groundColor.getStyle()
  }

  const hemisphereLightFolder = gui.addFolder('Hemisphere')
  hemisphereLightFolder.addColor(props, 'color').onChange((c) => light.color.setStyle(c))
  hemisphereLightFolder.addColor(props, 'groundColor').onChange((c) => light.groundColor.setStyle(c))
  hemisphereLightFolder.add(light, 'intensity', 0, 5, 0.1)
  hemisphereLightFolder.add(light.position, 'x', -30, 30, 0.1).name('positionX')
  hemisphereLightFolder.add(light.position, 'y', -30, 230, 0.1).name('positionY')
  hemisphereLightFolder.add(light.position, 'z', -30, 30, 0.1).name('positionZ')

  animate()
})
