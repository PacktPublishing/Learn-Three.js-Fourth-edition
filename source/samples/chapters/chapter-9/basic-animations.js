import { bootstrapMeshScene } from './util/standard-scene'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const texture = new THREE.TextureLoader().load('/assets/textures/particles/glow.png')

const modelAsync = () => {
  const geometry = new THREE.TorusKnotGeometry(2, 0.5, 150, 50, 3, 4)
  const material = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: false,
    color: 0xffffff,
    map: texture,
    depthWrite: false,
    opacity: 0.1,
    transparent: true,
    blending: THREE.AdditiveBlending
  })
  const mesh = new THREE.Points(geometry, material)
  mesh.userData.rotationSpeed = 0
  mesh.userData.scalingSpeed = 0
  mesh.userData.bouncingSpeed = 0
  mesh.userData.currentStep = 0
  mesh.userData.scalingStep = 0
  mesh.name = 'PointsMesh'

  return mesh
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  backgroundColor: 0x000000,
  hidefloor: true,
  addControls: (camera, renderer, scene, gui) => {
    const orbit = new OrbitControls(camera, renderer.domElement)
    orbit.update()
    const points = scene.getObjectByName('PointsMesh')

    const folder = gui.addFolder('Basic Animations')
    folder.add(points.userData, 'rotationSpeed', 0, 0.1, 0.001)
    folder.add(points.userData, 'scalingSpeed', 0, 0.02, 0.001)
    folder.add(points.userData, 'bouncingSpeed', 0, 0.03, 0.001)
  },
  onRender: (clock, controls, camera, scene) => {
    const points = scene.getObjectByName('PointsMesh')

    const rotationSpeed = points.userData.rotationSpeed
    const scalingSpeed = points.userData.scalingSpeed
    const bouncingSpeed = points.userData.bouncingSpeed
    const currentStep = points.userData.currentStep
    const scalingStep = points.userData.scalingStep

    points.rotation.x += rotationSpeed
    points.rotation.y += rotationSpeed
    points.rotation.z += rotationSpeed

    points.userData.currentStep = currentStep + bouncingSpeed
    points.position.x = Math.cos(points.userData.currentStep)
    points.position.y = Math.abs(Math.sin(points.userData.currentStep)) * 2

    points.userData.scalingStep = scalingStep + scalingSpeed
    var scaleX = Math.abs(Math.sin(scalingStep * 3 + 0.5 * Math.PI))
    var scaleY = Math.abs(Math.cos(scalingStep * 2))
    var scaleZ = Math.abs(Math.sin(scalingStep * 4 + 0.5 * Math.PI))
    points.scale.set(scaleX, scaleY, scaleZ)
  }
}).then()
