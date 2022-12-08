import * as THREE from 'three'
import { initScene } from '../../bootstrap/bootstrap'
import { floatingFloor } from '../../bootstrap/floor'
import { intializeRendererControls } from '../../controls/renderer-control'
import { initializeHelperControls } from '../../controls/helpers-control'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import GUI from 'lil-gui'
import { visitChildren } from '../../util/modelUtil'

const props = {
  backgroundColor: 0xffffff,
  // fogColor: 0xfff6bc
  fogColor: 0xffffff
}

// const props = {
//   backgroundColor: 0x111111,
//   // fogColor: 0xfff6bc
//   fogColor: 0xffffff
// }

const gui = new GUI()

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
  camera.position.x = -3
  camera.position.z = 8
  camera.position.y = 2
  orbitControls.update()

  const clock = new THREE.Clock()

  floatingFloor(scene)

  const loader = new GLTFLoader()
  let clipAction
  let mixer

  loader.load('/assets/gltf/windmill/scene.gltf', loadedObject => {
    const windmill = loadedObject.scene.children[0]
    visitChildren(windmill, (el) => {
      if (el.type === 'Mesh') {
        el.material.transparent = false
        el.material.side = THREE.DoubleSide
        el.material.alphaTest = 0.1
        el.material.needsUpdate = true
        el.material.opacity = 1

        el.castShadow = true
        el.receiveShadow = true
        console.log(el.material)
        console.log(el.name)

        el.material = new THREE.MeshStandardMaterial({
          map: el.material.map,
          metalnessMap: el.material.metalnessMap,
          alphaMap: el.material.alphaMap,
          opacity: 1,
          transparent: true,
          side: THREE.FrontSide
        })
      }
    })
    windmill.scale.set(80, 80, 80)
    windmill.translateZ(-2)
    windmill.translateX(1)
    windmill.translateY(1)
    windmill.rotateZ(-1.2)
    scene.add(windmill)

    mixer = new THREE.AnimationMixer(windmill)
    clipAction = mixer.clipAction(loadedObject.animations[0])
    clipAction.play()
  })

  function animate () {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    orbitControls.update()
    if (clipAction) {
      mixer.update(clock.getDelta())
    }
  }
  animate()

  intializeRendererControls(gui, renderer)
  initializeHelperControls(gui, scene)
})
