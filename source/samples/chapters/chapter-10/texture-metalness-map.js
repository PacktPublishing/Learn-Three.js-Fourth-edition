import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeGuiMeshPhongMaterial, initializeGuiMeshStandardMaterial } from '../../controls/material-controls'

const normalTexture = new THREE.TextureLoader().load(
  '/assets/textures/engraved/Engraved_Metal_003_NORM.jpg',
  (texture) => {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(4, 4)
  }
)

const metalnessTexture = new THREE.TextureLoader().load(
  '/assets/textures/engraved/Engraved_Metal_003_ROUGH.jpg',
  (texture) => {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(4, 4)
  }
)

const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
material.metalnessMap = metalnessTexture
material.normalMap = normalTexture

const props = {
  material: material,
  withMaterialGui: true,
  provideGui: (gui, mesh, material) => {
    initializeGuiMeshStandardMaterial(gui, mesh, material)

    gui.folders.map((f) => {
      if (f._title === 'Textures') {
        f.destroy()
      }
    })

    const props = {
      metalness: 1
    }
    const textureFolder = gui.addFolder('Textures')
    textureFolder.add(props, 'metalness', 0, 5, 0.001).onChange((v) => {
      material.metalness = v
      material.metalnessMap.needsUpdate = true
    })
  },
  onRender: (scene) => {
    const mesh = scene.getObjectByName('mesh')
    if (mesh) {
      mesh.rotation.y += 0.001
    }
  }
}

bootstrapMaterialScene(props).then()

// mention the other loaders in the text, and also explain RGBe and EXR. Don't show
// the loaders, but mention that we'll see them further down in the examples.
