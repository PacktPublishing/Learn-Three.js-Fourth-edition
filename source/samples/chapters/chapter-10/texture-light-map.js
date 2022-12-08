import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeGuiMeshBasicMaterial, initializeGuiMeshPhongMaterial } from '../../controls/material-controls'
import { sampleMaterialBall } from '../../models/models'

const textureLoader = new THREE.TextureLoader()
const colorMap = textureLoader.load('/assets/textures/wood/abstract-antique-backdrop-164005.jpg')
const lightMap = textureLoader.load('/assets/gltf/material_ball_in_3d-coat/lightMap.png')
const material = new THREE.MeshBasicMaterial({ color: 0xffffff })

material.map = colorMap
material.lightMap = lightMap
material.lightMap.flipY = false

const props = {
  material: material,
  withMaterialGui: true,
  provideGui: (gui, mesh, material, scene) => {
    // remove the default mesh we have
    scene.remove(mesh)

    // for this specific example load a single model and assign
    // the aomapped material
    sampleMaterialBall()
      .then((container) => {
        const mesh = container.children[0].children[0].children[0]
        mesh.name = 'mesh'
        mesh.rotation.x = -0.5 * Math.PI
        mesh.scale.setScalar(0.3)
        return mesh
      })
      .then((model) => scene.add(model))

    const floor = new THREE.PlaneGeometry(10, 10)
    const floorMesh = new THREE.Mesh(floor, material)
    const uv1 = floor.getAttribute('uv')
    const uv2 = uv1.clone()
    floor.setAttribute('uv2', uv2)
    floor.rotateX(-0.5 * Math.PI)
    floor.translate(0, -2.28, 0)

    scene.add(floorMesh)

    initializeGuiMeshBasicMaterial(gui, mesh, material)

    // remove the models folder, since we've got a specific map for this one
    gui.folders.map((f) => {
      if (f._title === 'Models') {
        f.destroy()
      }
    })
    const props = {
      lightMapIntensity: 1
    }
    const textureFolder = gui.addFolder('Textures')
    textureFolder.add(props, 'lightMapIntensity', 0, 5, 0.001).onChange((v) => {
      material.lightMapIntensity = v
      material.lightMap.needsUpdate = true
    })
  },
  onRender: (scene) => {}
}

bootstrapMaterialScene(props).then()
