import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeGuiMeshPhongMaterial } from '../../controls/material-controls'

const colorMap = new THREE.TextureLoader().load('/assets/textures/specular/Earth.png')
const specularMap = new THREE.TextureLoader().load('/assets/textures/specular/EarthSpec.png')
const normalMap = new THREE.TextureLoader().load('/assets/textures/specular/EarthNormal.png')

const material = new THREE.MeshPhongMaterial({ color: 0xffffff })
material.map = colorMap
material.specularMap = specularMap
material.normalMap = normalMap

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
      normalScaleY: 1
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
  },
  onRender: (scene) => {
    const mesh = scene.getObjectByName('mesh')
    if (mesh) {
      mesh.rotation.y += 0.001
    }
  }
}

bootstrapMaterialScene(props).then()
