import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeGuiMeshPhongMaterial } from '../../controls/material-controls'
// import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader'

// const exrLoader = new EXRLoader()
const groundTexture = new THREE.TextureLoader().load(
  '/assets/textures/red-bricks/red_bricks_04_diff_1k.jpg',
  (texture) => {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(2, 2)
  }
)
const heightTexture = new THREE.TextureLoader().load(
  '/assets/textures/red-bricks/red_bricks_04_nor_gl_1k.jpg',
  (texture) => {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(2, 2)
  }
)

const aoTexture = new THREE.TextureLoader().load('/assets/textures/red-bricks/red_bricks_04_ao_1k.jpg', (texture) => {
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
})

const material = new THREE.MeshPhongMaterial({ color: 0xffffff })
material.map = groundTexture
material.normalMap = heightTexture
material.aoMap = aoTexture

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
      normalScaleX: 1,
      normalScaleY: 1,
      aoMapIntensity: 1
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
    textureFolder.add(props, 'aoMapIntensity', 0, 5, 0.001).onChange((v) => {
      material.aoMapIntensity = v
      material.normalMap.needsUpdate = true
    })
  },
  onModelChanged: (mesh) => {
    const k = mesh.geometry
    const uv1 = k.getAttribute('uv')
    const uv2 = uv1.clone()
    k.setAttribute('uv2', uv2)
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
