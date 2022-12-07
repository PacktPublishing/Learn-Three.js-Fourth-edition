// TODO: - reuse most of the stuff from chapter 1 setup, and from the previous version of the book.
//       - rewrite using the new setup.

// explore all the scene options availabe.
// add the scene control
import * as THREE from 'three'
import { initScene } from '../../bootstrap/bootstrap'
import { floatingFloor } from '../../bootstrap/floor'
import { intializeRendererControls } from '../../controls/renderer-control'
import { initializeHelperControls } from '../../controls/helpers-control'
import { initializeSceneControls } from '../../controls/scene-controls'
import {
  initializeOrthographicCameraControls,
  initializePerspectiveCameraControls
} from '../../controls/camera-controls'

import GUI from 'lil-gui'
import { stats } from '../../util/stats'
import { initOrbitControls } from '../../controller/orbit-controller'

const props = { backgroundColor: 0xffffff, fogColor: 0xffffff }
const gui = new GUI()

const addCubes = (scene) => {
  const size = 0.9
  const cubeGeometry = new THREE.BoxGeometry(size, size, size)

  for (var j = 0; j < 10; j++) {
    for (var i = 0; i < 10; i++) {
      var rnd = Math.random() * 0.75 + 0.25
      var cubeMaterial = new THREE.MeshLambertMaterial()
      cubeMaterial.color = new THREE.Color(rnd, 0, 0)
      var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

      cube.position.z = -10 + 1 + j + 3.5
      cube.position.x = -10 + 1 + i + 4.5
      cube.position.y = -2

      scene.add(cube)
    }
  }
}

initScene(props)(({ scene, camera, renderer }) => {
  camera.position.set(-7, 2, 5)
  camera.lookAt(scene)

  let updatedOrbitControls = initOrbitControls(camera, renderer)

  floatingFloor(scene, 10)

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    stats.update()

    updatedOrbitControls.update()
  }
  animate()
  addCubes(scene)

  intializeRendererControls(gui, renderer)
  initializeHelperControls(gui, scene)
  initializeSceneControls(gui, scene)

  const props = new (function () {
    this.perspective = 'Perspective'
    this.switchCamera = function () {
      if (camera instanceof THREE.PerspectiveCamera) {
        camera = new THREE.OrthographicCamera(
          window.innerWidth / -8,
          window.innerWidth / 8,
          window.innerHeight / 8,
          window.innerHeight / -8,
          -10,
          50
        )
        camera.position.set(-2, 2, 2)
        camera.zoom = 12
        camera.updateProjectionMatrix()
        updatedOrbitControls = initOrbitControls(camera, renderer)

        this.perspective = 'Orthographic'
        initializeOrthographicCameraControls(camera, gui, updatedOrbitControls)
        updatedOrbitControls.update()
      } else {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.set(-7, 2, 5)
        camera.updateProjectionMatrix()
        this.perspective = 'Perspective'
        updatedOrbitControls = initOrbitControls(camera, renderer)
        initializePerspectiveCameraControls(camera, gui, updatedOrbitControls)
        updatedOrbitControls.update()
      }
    }
  })()

  gui.add(props, 'switchCamera')
  gui.add(props, 'perspective').listen()
  initializePerspectiveCameraControls(camera, gui, updatedOrbitControls)
})
