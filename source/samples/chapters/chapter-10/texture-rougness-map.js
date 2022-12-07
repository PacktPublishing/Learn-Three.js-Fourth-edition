import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeGuiMeshPhongMaterial, initializeGuiMeshStandardMaterial } from '../../controls/material-controls'

const colorTexture = new THREE.TextureLoader().load('/assets/textures/marble/marble_0008_color_2k.jpg', (texture) => {
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
})
const normalTexture = new THREE.TextureLoader().load(
  '/assets/textures/marble/marble_0008_normal_opengl_2k.png',
  (texture) => {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(2, 2)
  }
)
const roughnessTexture = new THREE.TextureLoader().load(
  '/assets/textures/marble/marble_0008_roughness_2k.jpg',
  (texture) => {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(2, 2)
  }
)

const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
material.map = colorTexture
material.normalMap = normalTexture
material.roughnessMap = roughnessTexture

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
      normalScaleX: 1,
      normalScaleY: 1,
      roughness: 1
    }
    const textureFolder = gui.addFolder('Textures')
    textureFolder.add(props, 'normalScaleX', 0, 5, 0.001).onChange(() => {
      material.normalScale.set(props.normalScaleX, props.normalScaleY)
      material.normalMap.needsUpdate = true
    })
    textureFolder.add(props, 'normalScaleY', 0, 5, 0.001).onChange(() => {
      material.normalScale.set(props.normalScaleX, props.normalScaleY)
      material.normalMap.needsUpdate = true
    })
    textureFolder.add(props, 'roughness', 0, 5, 0.001).onChange((v) => {
      material.roughness = v
      material.roughnessMap.needsUpdate = true
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
