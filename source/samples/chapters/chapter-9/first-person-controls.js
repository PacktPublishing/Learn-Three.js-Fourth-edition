import { bootstrapMeshScene } from './util/standard-scene'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { applyShadowsAndDepthWrite } from '../../util/modelUtil'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'

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
    const controls = new FirstPersonControls(camera, renderer.domElement)
    const props = {}

    const folder = gui.addFolder('First Person Controls')
    folder.add(controls, 'activeLook')
    folder.add(controls, 'autoForward')
    folder.add(controls, 'constraintVertical')
    folder.add(controls, 'enabled')
    folder.add(controls, 'heightCoef', 0, 10, 0.1)
    folder.add(controls, 'heightMax', 0, 10, 0.1)
    folder.add(controls, 'heightMin', 0, 10, 0.1)
    folder.add(controls, 'heightSpeed')
    folder.add(controls, 'lookVertical')
    folder.add(controls, 'lookSpeed', 0, 0.2, 0.0001)
    folder.add(controls, 'movementSpeed', 0, 10, 0.1)
    folder.add(controls, 'verticalMax', 0, Math.PI, 0.1)
    folder.add(controls, 'verticalMin', 0, Math.PI, 0.1)
    return controls
  },
  onRender: (clock, controls) => {
    controls.update(clock.getDelta())
  }
}).then()
