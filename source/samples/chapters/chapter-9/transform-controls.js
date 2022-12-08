import { bootstrapMeshScene } from './util/standard-scene'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'

const modelAsync = () => {
  const cubeMesh = new THREE.Mesh(
    new THREE.BoxBufferGeometry(3, 3, 3),
    new THREE.MeshPhongMaterial({ color: 0xff4444, transparent: true, opacity: 0.8 })
  )
  cubeMesh.name = 'cube'
  cubeMesh.translateX(-1)
  cubeMesh.translateY(-1)
  return cubeMesh
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  hidefloor: true,
  addControls: (camera, renderer, scene, gui, mesh) => {
    const orbit = new OrbitControls(camera, renderer.domElement)
    orbit.update()

    const controls = new TransformControls(camera, renderer.domElement)
    controls.attach(mesh)
    scene.add(controls)
    controls.addEventListener('dragging-changed', (event) => {
      orbit.enabled = !event.value
    })
    controls.update()

    window.addEventListener('keydown', (event) => {
      console.log(event.key)
      switch (event.key) {
        case 'Escape':
          controls.reset()
          break
      }
    })

    const props = {
      mode: 'translate',
      modes: ['translate', 'rotate', 'scale'],
      space: 'local',
      spaces: ['local', 'world'],
      translationSnap: 0,
      rotationSnap: 0,
      scaleSnap: 0
    }

    const folder = gui.addFolder('Transform Controls')
    folder.add(props, 'mode', props.modes).onChange((ev) => controls.setMode(ev))
    folder.add(controls, 'showX')
    folder.add(controls, 'showY')
    folder.add(controls, 'showZ')
    folder.add(controls, 'size', 0, 10, 0.1)
    folder.add(props, 'space', props.spaces).onChange((ev) => controls.setSpace(ev))
    folder.add(props, 'translationSnap', 0, 2, 0.1).onChange((ev) => controls.setTranslationSnap(ev))
    folder.add(props, 'rotationSnap', 0, 2, 0.1).onChange((ev) => controls.setTranslationSnap(ev))
    folder.add(props, 'scaleSnap', 0, 2, 0.1).onChange((ev) => controls.setTranslationSnap(ev))

    return controls
  }
}).then()
