import { bootstrapMeshScene } from './util/standard-scene'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { applyShadowsAndDepthWrite } from '../../util/modelUtil'
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls'

const modelAsync = () => {
  const loader = new GLTFLoader()
  return loader.loadAsync('/assets/models/bakery/scene.gltf').then((structure) => {
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
    const controls = new ArcballControls(camera, renderer.domElement, scene)
    controls.update()

    const props = {
      activateGizmosTrue: () => controls.activateGizmos(true),
      activateGizmosfalse: () => controls.activateGizmos(false),
      setGizmosVisibleTrue: () => controls.setGizmosVisible(true),
      setGizmosVisibleFalse: () => controls.setGizmosVisible(false)
    }

    const folder = gui.addFolder('ArcBall Controls')
    folder.add(controls, 'adjustNearFar')
    folder.add(controls, 'cursorZoom')
    folder.add(controls, 'enableAnimations')
    folder.add(controls, 'enableGrid')
    folder.add(controls, 'enablePan')
    folder.add(controls, 'enableRotate')
    folder.add(controls, 'enableZoom')
    folder.add(controls, 'maxDistance', 0, 100, 1)
    folder.add(controls, 'minDistance', 0, 10, 0.1)
    folder.add(controls, 'scaleFactor', 0.1, 4, 0.01)
    folder.add(controls, 'focusAnimationTime', 0, 2000, 1)
    folder.add(controls, 'dampingFactor', 0, 100, 1)
    folder.add(controls, 'wMax', 0, 100, 1)
    folder.add(controls, 'dampingFactor', 0, 100, 1)
    folder.add(controls, 'radiusFactor', 0, 1, 0.01).onChange(() => controls.setTbRadius(controls.radiusFactor))
    folder.add(props, 'activateGizmosTrue').name('activateGizmos(true)')
    folder.add(props, 'activateGizmosfalse').name('activateGizmos(false)')
    folder.add(props, 'setGizmosVisibleTrue').name('setGizmosVisible(true)')
    folder.add(props, 'setGizmosVisibleFalse').name('setGizmosVisible(false)')
  }
}).then()
