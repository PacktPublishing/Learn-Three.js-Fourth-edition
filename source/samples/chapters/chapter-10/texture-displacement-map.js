import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeGuiMeshPhongMaterial } from '../../controls/material-controls'

const colorMap = new THREE.TextureLoader().load('/assets/textures/displacement/w_c.jpg', (texture) => {
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
})
const displacementMap = new THREE.TextureLoader().load('/assets/textures/displacement/w_d.png', (texture) => {
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
})

const material = new THREE.MeshPhongMaterial({ color: 0xffffff })
material.map = colorMap
material.displacementMap = displacementMap

const props = {
  material: material,
  withMaterialGui: true,
  provideGui: (gui, mesh, material) => {
    initializeGuiMeshPhongMaterial(gui, mesh, material)

    gui.folders.map((f) => {
      if (f._title === 'Textures') {
        f.destroy()
      }
    })

    const props = {
      displacementScale: 1,
      displacementBias: 0
    }
    const textureFolder = gui.addFolder('Textures')
    textureFolder.add(props, 'displacementScale', 0, 1, 0.001).onChange((v) => {
      material.displacementScale = v
      material.displacementMap.needsUpdate = true
    })
    textureFolder.add(props, 'displacementBias', 0, 1, 0.001).onChange((v) => {
      material.displacementBias = v
      material.displacementMap.needsUpdate = true
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
