import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeGuiMeshPhongMaterial } from '../../controls/material-controls'
import { sampleMaterialBall } from '../../models/models'

const aoMap = new THREE.TextureLoader().load('/assets/gltf/material_ball_in_3d-coat/aoMap.png')
const material = new THREE.MeshPhongMaterial({ color: 0xffffff })
material.aoMap = aoMap
material.aoMap.flipY = false

const props = {
  material: material,
  withMaterialGui: true,
  provideGui: (gui, mesh, material, scene) => {
    // remove the default mesh we have
    scene.remove(mesh)

    // for this specific example load a single model and assign
    // the aomapped material
    sampleMaterialBall(material)
      .then((container) => {
        const mesh = container.children[0].children[0].children[0]
        mesh.name = 'mesh'
        mesh.rotation.x = -0.5 * Math.PI
        return mesh
      })
      .then((model) => scene.add(model))

    initializeGuiMeshPhongMaterial(gui, mesh, material)

    // remove the models folder, since we've got a specific map for this one
    gui.folders.map((f) => {
      if (f._title === 'Models') {
        f.destroy()
      }
    })
    const props = {
      aoMapIntensity: 1
    }
    const textureFolder = gui.addFolder('Textures')
    textureFolder.add(props, 'aoMapIntensity', 0, 5, 0.001).onChange((v) => {
      material.aoMapIntensity = v
      material.aoMap.needsUpdate = true
    })
  },
  onRender: (scene) => {
    const mesh = scene.getObjectByName('mesh')
    if (mesh) {
      mesh.rotation.z += 0.001
    }
  }
}

bootstrapMaterialScene(props).then()
