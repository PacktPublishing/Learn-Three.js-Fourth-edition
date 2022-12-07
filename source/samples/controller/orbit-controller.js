import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export const initOrbitControls = (camera, renderer) => {
  const controller = new OrbitControls(camera, renderer.domElement)
  controller.enableDamping = true
  controller.dampingFactor = 0.05
  controller.minDistance = 1
  controller.maxDistance = 100
  controller.minPolarAngle = Math.PI / 4
  controller.maxPolarAngle = (3 * Math.PI) / 4

  return controller
}
