import * as THREE from 'three'
import { initScene } from '../../bootstrap/bootstrap'
import { exrCubeMap } from '../../util/cubemap'
import { floatingFloor } from '../../bootstrap/floor'
import { intializeRendererControls } from '../../controls/renderer-control'
import { initializeHelperControls } from '../../controls/helpers-control'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import GUI from 'lil-gui'
import { visitChildren } from '../../util/modelUtil'

const props = {
  backgroundColor: 0xffffff,
  fogColor: 0xffffff
}

const gui = new GUI()

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
  camera.position.x = -3
  camera.position.z = 3
  camera.position.y = 0
  orbitControls.update()

  floatingFloor(scene)

  const loader = new GLTFLoader()
  loader.load('/assets/gltf/porsche/scene.gltf', (loadedObject) => {
    const porsche = loadedObject.scene.children[0]
    visitChildren(porsche, (el) => {
      if (el.type === 'Mesh') {
        if (el.material.name === 'paint') {
          el.material.color = new THREE.Color(0xffffff)
          el.material.metalness = 1
          el.material.roughness = 0.2

          exrCubeMap(renderer, (texture) => {
            if (el.material) {
              el.material.envMap = texture
              el.material.needsUpdate = true
            }
          })
        }

        el.castShadow = true
        el.receiveShadow = true
      }
    })
    porsche.translateZ(-1.9)
    porsche.translateX(0.3)
    porsche.translateY(0.6)
    porsche.rotateZ(-Math.PI / 2)
    scene.add(porsche)
  })

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    orbitControls.update()
  }
  animate()

  intializeRendererControls(gui, renderer)
  initializeHelperControls(gui, scene)
})
