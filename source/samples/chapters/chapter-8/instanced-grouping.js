import { bootstrapMeshScene } from './util/standard-scene'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'

const stats = Stats()
document.body.appendChild(stats.dom)

const modelAsync = () => {
  const size = 1
  const amount = 250000
  const range = 20

  const mat = new THREE.MeshNormalMaterial()
  mat.opacity = 0.1
  mat.transparent = true
  mat.blending = THREE.NormalBlending

  const g = new THREE.BoxGeometry(size, size, size)
  const mesh = new THREE.InstancedMesh(g, mat, amount)

  for (let i = 0; i < amount; i++) {
    const x = Math.random() * range - range / 2
    const y = Math.random() * range - range / 2
    const z = Math.random() * range - range / 2

    const matrix = new THREE.Matrix4()
    matrix.makeTranslation(x, y, z)
    mesh.setMatrixAt(i, matrix)
  }

  return mesh
}

bootstrapMeshScene({
  backgroundColor: 0x000000,
  loadMesh: modelAsync,
  hidefloor: true,
  onRender: () => stats.update()
}).then()
