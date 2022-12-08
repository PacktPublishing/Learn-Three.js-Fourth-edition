import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeGuiMeshPhongMaterial } from '../../controls/material-controls'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader'

const exrLoader = new EXRLoader()

const colorMap = exrLoader.load('/assets/textures/brick-wall/brick_wall_001_diffuse_2k.exr', (texture) => {
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 4)
})
const bumpMap = new THREE.TextureLoader().load(
  '/assets/textures/brick-wall/brick_wall_001_displacement_2k.png',
  (texture) => {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(4, 4)
  }
)

const material = new THREE.MeshPhongMaterial({ color: 0xffffff })
material.map = colorMap
material.bumpMap = bumpMap

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

    const textureFolder = gui.addFolder('Textures')
    textureFolder.add(material, 'bumpScale', 0, 1, 0.001).onChange(() => {
      material.bumpMap.needsUpdate = true
      console.log(material.bumpMap)
    })
  }
}

bootstrapMaterialScene(props).then()

// mention the other loaders in the text, and also explain RGBe and EXR. Don't show
// the loaders, but mention that we'll see them further down in the examples.
