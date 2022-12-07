import { bootstrapMeshScene } from './util/standard-scene'
import * as THREE from 'three'
import { addMeshProperties } from '../../controls/mesh-controls'

const modelAsync = () => {
  const mesh = new THREE.Mesh(
    new THREE.TorusKnotBufferGeometry(1, 0.1, 200, 10, 6, 7),
    new THREE.MeshStandardMaterial({ color: 0xffe65f })
  )

  mesh.castShadow = true
  return mesh
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  provideGui: (gui, mesh, scene) => {
    addMeshProperties(gui, mesh, 'Mesh')
    const folder = gui.addFolder('Save/load')
    const saveLoadProps = {
      load: () => {
        const fromStorage = localStorage.getItem('json')
        if (fromStorage) {
          const structure = JSON.parse(fromStorage)
          const loader = new THREE.ObjectLoader()
          const mesh = loader.parse(structure)
          mesh.material.color = new THREE.Color(0xff0000)
          scene.add(mesh)
        }
      },
      save: () => {
        const asJson = mesh.toJSON()
        localStorage.setItem('json', JSON.stringify(asJson))
        localStorage.setItem('scene', JSON.stringify(scene.toJSON()))
        console.log(scene.toJSON())
      }
    }
    folder.add(saveLoadProps, 'load')
    folder.add(saveLoadProps, 'save')
  }
}).then()
