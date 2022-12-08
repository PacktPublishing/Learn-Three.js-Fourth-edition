import { bootstrapMeshScene } from './util/standard-scene'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'

const modelAsync = () => {
  const group = new THREE.Group()
  const geom = new THREE.BoxGeometry(0.5, 0.5, 0.5)

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      for (let k = 0; k < 10; k++) {
        const mesh = new THREE.Mesh(
          geom,
          new THREE.MeshPhongMaterial({
            color: 0x3333ff * Math.random(),
            transparent: true,
            opacity: 0.9
          })
        )
        mesh.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5)
        mesh.castShadow = true
        mesh.receiveShadow = true
        group.add(mesh)
      }
    }
  }

  return group
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  hidefloor: true,
  addControls: (camera, renderer, scene, gui, mesh) => {
    const orbit = new OrbitControls(camera, renderer.domElement)
    orbit.update()

    const controls = new DragControls(mesh.children, camera, renderer.domElement)
    controls.addEventListener('dragstart', function (event) {
      orbit.enabled = false
      event.object.material.emissive.set(0x33333)
    })

    controls.addEventListener('dragend', function (event) {
      orbit.enabled = true
      event.object.material.emissive.set(0x000000)
    })

    return controls
  }
}).then()
