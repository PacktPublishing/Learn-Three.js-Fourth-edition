import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { initScene } from '../../bootstrap/bootstrap.js'
import { LightProbeGenerator } from 'three/examples/jsm/lights//LightProbeGenerator'
import { stats } from '../../util/stats'
import { visitChildren } from '../../util/modelUtil.js'

const props = {
  backgroundColor: 0xcccccc,
  disableLights: true
}
const loadIsland = (scene) => {
  const loader = new GLTFLoader()
  loader.load('/assets/gltf/flying_island/scene.gltf', (loadedObject) => {
    // the nested
    const loadedScene = loadedObject.scene.children[0].children[0].children[0]
    visitChildren(loadedScene, (c) => {
      c.receiveShadow = true
      c.castShadow = true
    })
    loadedScene.scale.set(0.022, 0.022, 0.022)
    loadedScene.translateY(-7)
    scene.add(loadedScene)
  })
}

const loadCubeMap = (renderer, scene) => {
  const base = 'drachenfels'
  const ext = 'png'
  const urls = [
    '/assets/panorama/' + base + '/posx.' + ext,
    '/assets/panorama/' + base + '/negx.' + ext,
    '/assets/panorama/' + base + '/posy.' + ext,
    '/assets/panorama/' + base + '/negy.' + ext,
    '/assets/panorama/' + base + '/posz.' + ext,
    '/assets/panorama/' + base + '/negz.' + ext
  ]

  new THREE.CubeTextureLoader().load(urls, function (cubeTexture) {
    cubeTexture.encoding = THREE.sRGBEncoding
    scene.background = cubeTexture
    const lp = LightProbeGenerator.fromCubeTexture(cubeTexture)
    lp.intensity = 15
    scene.add(lp)
  })
}

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
  camera.position.set(-7, 2, 5)
  orbitControls.update()

  loadIsland(scene)

  loadCubeMap(renderer, scene)

  const lightProbe = new THREE.LightProbe()
  scene.add(lightProbe)

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    stats.update()

    orbitControls.update()
  }

  animate()
})
