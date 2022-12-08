import { bootstrapMeshScene } from './util/standard-scene'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { visitChildren } from '../../util/modelUtil'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'

const modelAsync = () => {
  const loader = new GLTFLoader()
  return loader.loadAsync('/assets/models/trailer/scene.gltf').then((structure) => {
    // position scene
    structure.scene.scale.setScalar(2)
    structure.scene.translateY(-1)
    structure.scene.rotateY(-1.4)

    // make sure all cast shadows
    visitChildren(structure.scene, (child) => {
      if (child.material) {
        child.material.depthWrite = true
      }
    })

    return structure.scene
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  hidefloor: true,
  addControls: (camera, renderer, scene, gui) => {
    const controls = new TrackballControls(camera, renderer.domElement)

    const folder = gui.addFolder('Trackball Controls')
    folder.add(controls, 'maxDistance', 0, 1000, 10)
    folder.add(controls, 'minDistance', 0, 10, 0.1)
    folder.add(controls, 'noPan')
    folder.add(controls, 'noRotate')
    folder.add(controls, 'noZoom')
    folder.add(controls, 'panSpeed', 0, 5, 0.1)
    folder.add(controls, 'rotateSpeed', 0, 5, 0.1)
    folder.add(controls, 'zoomSpeed', 0, 5, 0.1)
    folder.add(controls, 'staticMoving', 0, 5, 0.1)

    return controls
  },
  onRender: (clock, controls) => {
    controls.update(clock.getDelta())
  }
}).then()
