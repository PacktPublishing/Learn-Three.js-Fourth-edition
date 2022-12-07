import { bootstrapMeshScene } from './util/standard-scene'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { addMeshProperties } from '../../controls/mesh-controls'

const stats = Stats()
document.body.appendChild(stats.dom)

const modelAsync = () => {
  const size = 1
  const amount = 5000
  const range = 20

  const group = new THREE.Group()
  const mat = new THREE.MeshNormalMaterial()
  mat.blending = THREE.NormalBlending
  mat.opacity = 0.1
  mat.transparent = true

  for (let i = 0; i < amount; i++) {
    const x = Math.random() * range - range / 2
    const y = Math.random() * range - range / 2
    const z = Math.random() * range - range / 2

    const g = new THREE.BoxGeometry(size, size, size)
    const m = new THREE.Mesh(g, mat)
    m.position.set(x, y, z)
    group.add(m)
  }

  return group
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  hidefloor: true,
  onRender: () => stats.update(),
  backgroundColor: 0x000000,
  provideGui: (gui, mesh) => {
    addMeshProperties(gui, mesh, 'Group')
  }
}).then()
