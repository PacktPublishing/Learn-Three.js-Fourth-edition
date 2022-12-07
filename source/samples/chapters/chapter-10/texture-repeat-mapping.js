import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeGuiMeshPhongMaterial, initializeGuiMeshStandardMaterial } from '../../controls/material-controls'
import { MirroredRepeatWrapping } from 'three'
// import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader'

// const exrLoader = new EXRLoader()
const colorTexture = new THREE.TextureLoader().load(
  '/assets/textures/red-bricks/red_bricks_04_diff_1k.jpg',
  (texture) => {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
  }
)
const normalTexture = new THREE.TextureLoader().load(
  '/assets/textures/red-bricks/red_bricks_04_nor_gl_1k.jpg',
  (texture) => {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
  }
)

// const roughnessTexture = new THREE.TextureLoader().load(
//   '/assets/textures/red-bricks/red_bricks_04_rough_gl_1k.jpg',
//   (texture) => {
//     texture.wrapS = THREE.RepeatWrapping
//     texture.wrapT = THREE.RepeatWrapping
//   }
// )

const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
material.map = colorTexture
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

    const wrappingTypes = {
      repeatWrapping: THREE.RepeatWrapping,
      clampToEdgeWrapping: THREE.ClampToEdgeWrapping,
      mirroredRepeatWrapping: THREE.MirroredRepeatWrapping
    }

    const props = {
      normalScaleX: 1,
      normalScaleY: 1,
      repeatX: 1,
      repeatY: 1,
      wrappingType: THREE.RepeatWrapping
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
    textureFolder.add(props, 'repeatX', 1, 10, 1).onChange(() => {
      material.normalScale.set(props.normalScaleX, props.normalScaleY)
      material.normalMap.needsUpdate = true
      material.normalMap.repeat.set(props.repeatX, props.repeatY)
      material.map.repeat.set(props.repeatX, props.repeatY)
    })
    textureFolder.add(props, 'repeatY', 1, 10, 1).onChange(() => {
      material.normalScale.set(props.normalScaleX, props.normalScaleY)
      material.normalMap.repeat.set(props.repeatX, props.repeatY)
      material.map.repeat.set(props.repeatX, props.repeatY)
    })
    textureFolder.add(props, 'wrappingType', wrappingTypes).onChange(() => {
      material.normalMap.wrapS = props.wrappingType
      material.normalMap.wrapT = props.wrappingType
      material.map.wrapS = props.wrappingType
      material.map.wrapT = props.wrappingType

      material.map.needsUpdate = true
      material.normalMap.needsUpdate = true
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
