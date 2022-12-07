import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeGuiMeshPhongMaterial } from '../../controls/material-controls'

const textureLoader = new THREE.TextureLoader()

const groundTexture = textureLoader.load('/assets/textures/ground/ground_0036_color_1k.jpg')
const marbleTexture = textureLoader.load('/assets/textures/marble/marble_0008_color_2k.jpg')
const wood1Texture = textureLoader.load('/assets/textures/wood/abstract-antique-backdrop-164005.jpg')
const wood2Texture = textureLoader.load('/assets/textures/wood/floor-parquet-pattern-172292.jpg')
const bricksTexture = textureLoader.load('/assets/textures/red-bricks/red_bricks_04_diff_1k.jpg')
const textures = {
  Ground: groundTexture,
  Marble: marbleTexture,
  Wood1: wood1Texture,
  Wood2: wood2Texture,
  Bricks: bricksTexture
}

const material = new THREE.MeshPhongMaterial({ color: 0xffffff })
material.map = wood1Texture

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
    textureFolder.add(material, 'map', textures).onChange(() => (material.map.needsUpdate = true))
  }
}

bootstrapMaterialScene(props).then()

// mention the other loaders in the text, and also explain RGBe and EXR. Don't show
// the loaders, but mention that we'll see them further down in the examples.
