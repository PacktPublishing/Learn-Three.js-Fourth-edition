import { bootstrapMeshScene } from './util/standard-scene'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'

const modelAsync = () => {
  const group = new THREE.Group()
  const geom = new THREE.BoxGeometry(0.9, 0.9, 0.9)

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      for (let k = 0; k < 10; k++) {
        const mesh = new THREE.Mesh(
          geom,
          new THREE.MeshPhongMaterial({
            color: 0x3333ff * Math.random(),
            transparent: true,
            opacity: 0.6
          })
        )
        mesh.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5)
        mesh.castShadow = true
        mesh.receiveShadow = true
        group.add(mesh)
      }
    }
  }
  group.name = 'group'

  return group
}

let pointer = {
  x: -1,
  y: -1
}

let raycaster = undefined
let intersected = null
let selectAll = false

bootstrapMeshScene({
  loadMesh: modelAsync,
  hidefloor: true,
  addControls: (camera, renderer, scene, gui, mesh) => {
    raycaster = new THREE.Raycaster()

    document.addEventListener('mousemove', (event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
    })

    const props = {
      selectAll: false
    }

    const folder = gui.addFolder('Selecting objects')
    folder.add(props, 'selectAll').onChange((ev) => (selectAll = ev))

    const orbit = new OrbitControls(camera, renderer.domElement)
    orbit.update()
  },
  onRender: (clock, control, camera, scene) => {
    if (raycaster) {
      raycaster.setFromCamera(pointer, camera)
      const cubes = scene.getObjectByName('group').children
      const intersects = raycaster.intersectObjects(cubes, false)

      if (selectAll) {
        cubes.forEach((c) => c.material.emissive.setHex(0x000000))
        if (intersects.length > 0) {
          intersects.forEach((selected) => {
            let selectedObject = selected.object
            selectedObject.currentHex = selectedObject.material.emissive.getHex()
            selectedObject.material.emissive.setHex(0xff0000)
          })
        }
      } else {
        if (intersects.length > 0) {
          if (intersected != intersects[0].object) {
            if (intersected) intersected.material.emissive.setHex(intersected.currentHex)
            intersected = intersects[0].object
            intersected.currentHex = intersected.material.emissive.getHex()
            intersected.material.emissive.setHex(0xff0000)
            console.log(intersects[0])
          }
        }
      }
    }
  }
}).then()
