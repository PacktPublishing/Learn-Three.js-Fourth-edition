import { bootstrapMeshScene } from './util/standard-scene'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { visitChildren } from '../../util/modelUtil'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const modelAsync = () => {
  const loader = new GLTFLoader()
  return loader.loadAsync('/assets/models/canon_retro_camera/scene.gltf').then((structure) => {
    // position scene
    structure.scene.scale.setScalar(35, 35, 35)

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
    const controls = new OrbitControls(camera, renderer.domElement)

    const folder = gui.addFolder('Orbit Controls')
    folder.add(controls, 'autoRotate')
    folder.add(controls, 'autoRotateSpeed', 0, 30, 0.1)
    folder.add(controls, 'dampingFactor', 0, 0.2, 0.001)
    folder.add(controls, 'enableDamping')
    folder.add(controls, 'enablePan')
    folder.add(controls, 'enableRotate')
    folder.add(controls, 'enableZoom')
    folder.add(controls, 'keyPanSpeed', 0, 20, 1)
    folder.add(controls, 'maxAzimuthAngle', -2 * Math.PI, 2 * Math.PI, 0.1)
    folder.add(controls, 'maxDistance', 0, 1000, 10)
    folder.add(controls, 'maxPolarAngle', 0, Math.PI, 0.1)
    // folder.add(controls, 'maxZoom', 0, 20, 0.1) // only ortho
    folder.add(controls, 'minAzimuthAngle', Math.PI, 0.1)
    folder.add(controls, 'minDistance', 0, 10, 0.1)
    folder.add(controls, 'minPolarAngle', 0, Math.PI, 0.1)
    // folder.add(controls, 'minZoom', 0, 5, 0.1) // only ortho
    folder.add(controls, 'panSpeed', 0, 5, 0.1)
    folder.add(controls, 'rotateSpeed', 0, 5, 0.1)
    folder.add(controls, 'screenSpacePanning')
    folder.add(controls, 'zoomSpeed', 0, 5, 0.1)

    return controls
  },
  onRender: (clock, controls) => {
    controls.update(clock.getDelta())
  }
}).then()
