import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { visitChildren } from '../util/modelUtil'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'

const loader = new GLTFLoader()

export const sampleCube = (material, size) => {
  const s = size ?? 1
  const cubeGeom = new THREE.BoxGeometry(s, s, s, 10, 10, 10)
  const cubeMesh = new THREE.Mesh(cubeGeom, material)

  return cubeMesh
}

export const sampleSphere = (material) => {
  const floatingSphereGeom = new THREE.SphereBufferGeometry(1, 16, 12)
  const floatingSphereMesh = new THREE.Mesh(floatingSphereGeom, material)

  return floatingSphereMesh
}

export const sampleGosper = (material) => {
  const points = gosper(4, 50)
  const colors = new Float32Array(points.length * 3)
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
  points.forEach((e, i) => {
    const color = new THREE.Color(0xffffff)
    color.setHSL(e.x / 100 + 0.5, (e.y * 20) / 400, 0.2)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  })

  lineGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3, true))
  const mesh = new THREE.Line(lineGeometry, material)

  mesh.computeLineDistances()
  mesh.scale.set(0.1, 0.1, 0.1)
  mesh.translateY(-2)

  return mesh
}

export const sampleKnot = (material) => {
  const knotGeom = new THREE.TorusKnotBufferGeometry(2, 0.4, 200, 30, 2, 3)
  const knotMesh = new THREE.Mesh(knotGeom, material)

  knotMesh.receiveShadow = true
  knotMesh.castShadow = true

  return knotMesh
}

export const sampleFox = async (material) => {
  const loadedObject = await loader.loadAsync('/assets/gltf/fox/fox.glb')
  visitChildren(loadedObject.scene, (c) => {
    c.receiveShadow = true
    c.castShadow = true

    if (material) {
      c.material = material
    }
    if (c.geometry) {
      // for smooth models
      c.geometry = BufferGeometryUtils.mergeVertices(c.geometry)
      c.geometry.computeVertexNormals()
    }
  })
  loadedObject.scene.scale.set(0.07, 0.07, 0.07)
  loadedObject.scene.translateY(-1)

  return loadedObject.scene
}

export const sampleVertexColors = async (material) => {
  const loadedObject = await loader.loadAsync('/assets/gltf/vertex-colors/vertex-colors.glb')

  visitChildren(loadedObject.scene, (c) => {
    c.receiveShadow = true
    c.castShadow = true
    if (material) c.material = material
    if (c.geometry) {
      c.geometry.deleteAttribute('normal')
      c.geometry = BufferGeometryUtils.mergeVertices(c.geometry)
      c.geometry.computeVertexNormals()
    }
  })
  loadedObject.scene.scale.set(1.7, 1.7, 1.7)
  loadedObject.scene.translateY(1)

  return loadedObject.scene
}

export const sampleMaterialBall = async (material) => {
  // const loadedObject = await loader.loadAsync('/assets/gltf/material_ball/material_ball_v2.glb')
  const loadedObject = await loader.loadAsync('/assets/gltf/material_ball_in_3d-coat/scene.gltf')

  visitChildren(loadedObject.scene, (c) => {
    c.receiveShadow = true
    c.castShadow = true
    if (material) c.material = material
    if (c.geometry) {
      c.geometry.computeVertexNormals()
    }
  })
  loadedObject.scene.scale.set(0.5, 0.5, 0.5)

  return loadedObject.scene
}

function gosper(a, b) {
  var turtle = [0, 0, 0]
  var points = []
  var count = 0
  rg(a, b, turtle)
  return points

  function rt(x) {
    turtle[2] += x
  }

  function lt(x) {
    turtle[2] -= x
  }

  function fd(dist) {
    points.push({
      x: turtle[0],
      y: turtle[1],
      z: Math.sin(count) * 5
    })
    var dir = turtle[2] * (Math.PI / 180)
    turtle[0] += Math.cos(dir) * dist
    turtle[1] += Math.sin(dir) * dist

    points.push({
      x: turtle[0],
      y: turtle[1],
      z: Math.sin(count) * 5
    })
  }

  function rg(st, ln, turtle) {
    st--
    ln = ln / 2.6457
    if (st > 0) {
      rg(st, ln, turtle)
      rt(60)
      gl(st, ln, turtle)
      rt(120)
      gl(st, ln, turtle)
      lt(60)
      rg(st, ln, turtle)
      lt(120)
      rg(st, ln, turtle)
      rg(st, ln, turtle)
      lt(60)
      gl(st, ln, turtle)
      rt(60)
    }
    if (st == 0) {
      fd(ln)
      rt(60)
      fd(ln)
      rt(120)
      fd(ln)
      lt(60)
      fd(ln)
      lt(120)
      fd(ln)
      fd(ln)
      lt(60)
      fd(ln)
      rt(60)
    }
  }

  function gl(st, ln, turtle) {
    st--
    ln = ln / 2.6457
    if (st > 0) {
      lt(60)
      rg(st, ln, turtle)
      rt(60)
      gl(st, ln, turtle)
      gl(st, ln, turtle)
      rt(120)
      gl(st, ln, turtle)
      rt(60)
      rg(st, ln, turtle)
      lt(120)
      rg(st, ln, turtle)
      lt(60)
      gl(st, ln, turtle)
    }
    if (st == 0) {
      lt(60)
      fd(ln)
      rt(60)
      fd(ln)
      fd(ln)
      rt(120)
      fd(ln)
      rt(60)
      fd(ln)
      lt(120)
      fd(ln)
      lt(60)
      fd(ln)
    }
  }
}
