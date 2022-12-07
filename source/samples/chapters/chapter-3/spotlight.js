import * as THREE from 'three'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { initScene } from '../../bootstrap/bootstrap.js'
import { intializeRendererControls } from '../../controls/renderer-control.js'
import { stats } from '../../util/stats'
import { visitChildren } from '../../util/modelUtil.js'

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
    visitChildren(loadedScene, (c) => {
      c.receiveShadow = true
      c.castShadow = true
    })
    loadedScene.rotateX(-0.5 * Math.PI)
    scene.add(loadedScene)
  })
}

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  camera.position.set(-4, 14, 4)
  orbitControls.update()

  loadWaterfall(scene)

  const spotLight = new THREE.SpotLight()
  const spotLightHelper = new THREE.SpotLightHelper(spotLight)
  const shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
  spotLightHelper.visible = false
  shadowCameraHelper.visible = false

  scene.add(spotLightHelper)
  scene.add(shadowCameraHelper)

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    stats.update()
    spotLightHelper.update()
    shadowCameraHelper.update()
    orbitControls.update()
    spotLight.shadow.camera.updateProjectionMatrix()
    spotLight.shadow.camera.matrixWorldNeedsUpdate = true
  }

  const colorHolder = new THREE.Color(0xffffff)
  const light = new THREE.AmbientLight(0x222222)
  scene.add(light)
  scene.add(spotLight.target)

  spotLight.penumbra = 0.4
  spotLight.position.set(10, 14, 5)
  spotLight.distance = 0
  spotLight.castShadow = true
  spotLight.intensity = 1
  spotLight.shadow.camera.near = 10
  spotLight.shadow.camera.far = 25
  spotLight.shadow.camera.right = 10
  spotLight.shadow.camera.left = -10
  spotLight.shadow.camera.top = 10
  spotLight.shadow.camera.bottom = -10
  spotLight.shadow.mapSize.width = 2048
  spotLight.shadow.mapSize.height = 2048
  spotLight.shadow.bias = -0.01

  const props = {
    color: colorHolder.getStyle()
  }

  const spotLightFolder = gui.addFolder('Spotlight')
  spotLightFolder.addColor(props, 'color').onChange((c) => spotLight.color.setStyle(c))
  spotLightFolder.add(spotLight, 'intensity', 0, 5, 0.1)
  spotLightFolder.add(spotLight, 'distance', 0, 100, 0.1)
  spotLightFolder.add(spotLight, 'angle', 0, Math.PI / 2, 0.01)
  spotLightFolder.add(spotLight, 'decay', 0, 5, 0.01)
  spotLightFolder.add(spotLight, 'penumbra', 0, 1, 0.01)
  spotLightFolder.add(spotLight.position, 'x', -30, 30, 0.1).name('positionX')
  spotLightFolder.add(spotLight.position, 'y', -30, 30, 0.1).name('positionY')
  spotLightFolder.add(spotLight.position, 'z', -30, 30, 0.1).name('positionZ')
  spotLightFolder.add(spotLight.target.position, 'x', -30, 30, 0.1).name('targetX')
  spotLightFolder.add(spotLight.target.position, 'y', -30, 30, 0.1).name('targetY')
  spotLightFolder.add(spotLight.target.position, 'z', -30, 30, 0.1).name('targetZ')

  spotLightFolder.add(spotLight, 'castShadow')
  spotLightFolder.add(spotLightHelper, 'visible').name('spotlight-helper')

  const shadowCameraFolder = gui.addFolder('ShadowCamera')
  shadowCameraFolder.add(shadowCameraHelper, 'visible').name('shadow-helper')
  shadowCameraFolder.add(spotLight.shadow.camera, 'far', 0, 100, 0.1)
  shadowCameraFolder.add(spotLight.shadow.camera, 'near', 0, 20, 0.1)

  scene.add(spotLight)

  intializeRendererControls(gui, renderer)

  animate()
})
