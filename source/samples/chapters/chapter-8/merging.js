import { bootstrapMeshScene } from './util/standard-scene'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { addMeshProperties } from '../../controls/mesh-controls'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'

const stats = Stats()
document.body.appendChild(stats.dom)

BufferGeometryUtils

const modelAsync = () => {
  const size = 1
  const amount = 500000
  const range = 20

  const mat = new THREE.MeshNormalMaterial()
  mat.blending = THREE.NormalBlending
  mat.opacity = 0.1
  mat.transparent = true

  const geoms = []

  for (let i = 0; i < amount; i++) {
    const x = Math.random() * range - range / 2
    const y = Math.random() * range - range / 2
    const z = Math.random() * range - range / 2

    const g = new THREE.BoxGeometry(size, size, size)
    g.translate(x, y, z)
    geoms.push(g)
  }

  const merged = BufferGeometryUtils.mergeBufferGeometries(geoms)
  const mesh = new THREE.Mesh(merged, mat)

  return mesh
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
