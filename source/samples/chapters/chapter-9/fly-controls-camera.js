import { bootstrapMeshScene } from './util/standard-scene'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { applyShadowsAndDepthWrite } from '../../util/modelUtil'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'

const modelAsync = () => {
  const loader = new GLTFLoader()
  return loader.loadAsync('/assets/models/new_york_city_manhattan/scene.gltf').then((structure) => {
    // position scene
    structure.scene.scale.setScalar(5, 5, 5)

    // make sure all cast shadows
    applyShadowsAndDepthWrite(structure.scene)
    return structure.scene
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  hidefloor: true,
  addControls: (camera, renderer, scene, gui) => {
    const controls = new FlyControls(camera, renderer.domElement)

    const folder = gui.addFolder('First Person Controls')
    folder.add(controls, 'dragToLook')
    folder.add(controls, 'autoForward')
    folder.add(controls, 'movementSpeed', 0, 10, 0.1)
    folder.add(controls, 'rollSpeed', 0, 1, 0.1)
    return controls
  },
  onRender: (clock, controls) => {
    controls.update(clock.getDelta())
  }
}).then()
