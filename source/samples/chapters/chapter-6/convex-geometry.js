import * as THREE from 'three'
import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry'

const generatePoints = () => {
  const spGroup = new THREE.Object3D()
  spGroup.name = 'spGroup'
  const points = []

  for (let i = 0; i < 20; i++) {
    const randomX = -5 + Math.round(Math.random() * 10)
    const randomY = -5 + Math.round(Math.random() * 10)
    const randomZ = -5 + Math.round(Math.random() * 10)
    points.push(new THREE.Vector3(randomX, randomY, randomZ))
  }

  const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: false })
  points.forEach(function (point) {
    const spGeom = new THREE.SphereGeometry(0.04)
    const spMesh = new THREE.Mesh(spGeom, material)
    spMesh.position.copy(point)
    spGroup.add(spMesh)
  })

  return {
    spGroup,
    points
  }
}

const updateGeometry = (scene) => {
  const { spGroup, points } = generatePoints()
  if (scene) {
    const maybeSpGroup = scene.getObjectByName('spGroup')
    if (maybeSpGroup) scene.remove(maybeSpGroup)
    scene.add(spGroup)
  }

  const convexGeometry = new ConvexGeometry(points)
  return convexGeometry
}

const geometry = updateGeometry()

bootstrapGeometryScene({
  geometry,
  provideGui: (gui, mesh, scene) => {
    updateMesh(mesh, updateGeometry(scene))
    const folder = gui.addFolder('THREE.ConvexGeometry')
    folder.add({ redraw: () => updateMesh(mesh, updateGeometry(scene)) }, 'redraw')
  }
}).then()
