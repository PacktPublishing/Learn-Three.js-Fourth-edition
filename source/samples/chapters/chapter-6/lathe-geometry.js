import * as THREE from 'three'
import { bootstrapGeometryScene } from './util/standard-scene'
import { updateMesh } from './util'

const props = {
  segments: 20,
  phiStart: 0,
  phiLength: 2 * Math.PI
}

const generatePoints = () => {
  const spGroup = new THREE.Object3D()
  spGroup.name = 'spGroup'
  const points = []

  const height = 0.4
  const count = 25
  for (let i = 0; i < count; i++) {
    points.push(new THREE.Vector3((Math.sin(i * 0.4) + Math.cos(i * 0.4)) * height + 3, i / 6, 0))
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

const updateGeometry = ({ segments, phiStart, phiLength }, scene) => {
  const { spGroup, points } = generatePoints()

  if (scene) {
    const maybeSpGroup = scene.getObjectByName('spGroup')
    if (maybeSpGroup) scene.remove(maybeSpGroup)
    scene.add(spGroup)
  }

  const latheGeometry = new THREE.LatheGeometry(points, segments, phiStart, phiLength)
  return latheGeometry
}

const geometry = updateGeometry(props)

bootstrapGeometryScene({
  geometry,
  provideGui: (gui, mesh, scene) => {
    updateMesh(mesh, updateGeometry(props, scene))
    const folder = gui.addFolder('THREE.LatheGeometry')
    folder.add(props, 'segments', 1, 30, 1).onChange(() => updateMesh(mesh, updateGeometry(props), scene))
    folder.add(props, 'phiStart', 0, 2 * Math.PI, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props), scene))
    folder
      .add(props, 'phiLength', 1, 2 * Math.PI, 1, 0.01)
      .onChange(() => updateMesh(mesh, updateGeometry(props), scene))
  }
}).then()
