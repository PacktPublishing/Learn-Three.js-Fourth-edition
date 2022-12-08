import * as THREE from 'three'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { initScene } from '../../bootstrap/bootstrap.js'
import { intializeRendererControls } from '../../controls/renderer-control.js'
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare'
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

  const pointLight = new THREE.PointLight()
  const pointLightHelper = new THREE.PointLightHelper(pointLight)
  scene.add(pointLightHelper)

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    stats.update()
    pointLightHelper.update()
    orbitControls.update()
  }

  const colorHolder = new THREE.Color(0xffffff)
  const light = new THREE.AmbientLight(0x222222)
  scene.add(light)

  pointLight.position.set(10, 14, 5)
  pointLight.castShadow = true
  pointLight.shadow.camera.near = 1
  pointLight.shadow.camera.far = 25
  pointLight.shadow.camera.right = 10
  pointLight.shadow.camera.left = -10
  pointLight.shadow.camera.top = 10
  pointLight.shadow.camera.bottom = -10
  pointLight.shadow.mapSize.width = 2048
  pointLight.shadow.mapSize.height = 2048
  pointLight.shadow.bias = -0.01

  const textureLoader = new THREE.TextureLoader()
  const textureFlare0 = textureLoader.load('/assets/textures/lens-flares/lensflare0.png')
  const textureFlare1 = textureLoader.load('/assets/textures/lens-flares/lensflare3.png')

  const lensFlare = new Lensflare()
  lensFlare.addElement(new LensflareElement(textureFlare0, 512, 0))
  lensFlare.addElement(new LensflareElement(textureFlare1, 60, 0.6))
  lensFlare.addElement(new LensflareElement(textureFlare1, 70, 0.7))
  lensFlare.addElement(new LensflareElement(textureFlare1, 120, 0.9))
  lensFlare.addElement(new LensflareElement(textureFlare1, 70, 1.0))

  pointLight.add(lensFlare)

  const props = {
    color: colorHolder.getStyle()
  }

  const spotLightFolder = gui.addFolder('Spotlight')
  spotLightFolder.addColor(props, 'color').onChange((c) => pointLight.color.setStyle(c))
  spotLightFolder.add(pointLight, 'intensity', 0, 5, 0.1)
  spotLightFolder.add(pointLight, 'decay', 0, 5, 0.01)
  spotLightFolder.add(pointLight.position, 'x', -30, 30, 0.1).name('positionX')
  spotLightFolder.add(pointLight.position, 'y', -30, 30, 0.1).name('positionY')
  spotLightFolder.add(pointLight.position, 'z', -30, 30, 0.1).name('positionZ')

  spotLightFolder.add(pointLight, 'castShadow')
  spotLightFolder.add(pointLightHelper, 'visible').name('pointlight-helper')

  scene.add(pointLight)

  intializeRendererControls(gui, renderer)

  animate()
})
