import { bootstrapMeshScene } from './util/standard-scene'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { applyShadowsAndDepthWrite } from '../../util/modelUtil'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory'
import * as THREE from 'three'

const modelAsync = () => {
  const loader = new GLTFLoader()
  return loader.loadAsync('/assets/models/medieval_fantasy_book/scene.gltf').then((structure) => {
    // position scene
    structure.scene.scale.setScalar(0.8, 0.8, 0.8)
    structure.scene.translateY(-1.8)
    structure.scene.translateX(-1.8)

    // make sure all cast shadows
    applyShadowsAndDepthWrite(structure.scene)
    return structure.scene
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  hidefloor: true,
  addControls: (camera, renderer, scene, gui) => {
    document.body.appendChild(VRButton.createButton(renderer))
    const controllerModelFactory = new XRControllerModelFactory()

    const controllerGrip1 = renderer.xr.getControllerGrip(0)
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1))
    scene.add(controllerGrip1)

    const controllerGrip2 = renderer.xr.getControllerGrip(1)
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2))
    scene.add(controllerGrip2)

    const controller = renderer.xr.getController(0)
    controller.addEventListener('selectstart', () => {
      console.log('start', controller)
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshNormalMaterial())
      mesh.position.copy(controller.position)
      scene.add(mesh)
    })
    controller.addEventListener('selectend', () => {
      console.log('end', controller)
    })

    return {}
  },
  onRender: (clock, controls, rend) => {}
}).then()
