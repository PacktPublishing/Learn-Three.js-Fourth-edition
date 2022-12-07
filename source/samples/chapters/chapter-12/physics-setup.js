import { bootstrapMeshScene } from './util/standard-scene-empty'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as THREE from 'three'
import { RigidBodyType } from '@dimforge/rapier3d'

import('@dimforge/rapier3d').then((RAPIER) => {
  const gravity = { x: 0.0, y: -9.81, z: 0.0 }
  const world = new RAPIER.World(gravity)

  const geo = new THREE.BoxBufferGeometry(5, 0.25, 5, 10, 10, 10)
  const mat = new THREE.MeshStandardMaterial({
    color: 0xdddddd
  })
  const floor = new THREE.Mesh(geo, mat)

  const sampleMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial())
  sampleMesh.position.set(0, 4, 0)

  const rigidBodyDesc = new RAPIER.RigidBodyDesc(RigidBodyType.Dynamic)
    .setTranslation(0.0, 4, 0)
    .setRotation({ w: 1.0, x: 0.0, y: 0.0, z: 0.0 })
    .setGravityScale(1)
    .setCanSleep(true)
    .setCcdEnabled(false)
  const rigidBody = world.createRigidBody(rigidBodyDesc)
  // rigidBody.setAdditionalMass(0.0001)
  const rigidBodyColliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
  const rigidBodyCollider = world.createCollider(rigidBodyColliderDesc, rigidBody)
  rigidBodyCollider.setRestitution(1)
  const floorBodyDesc = new RAPIER.RigidBodyDesc(RigidBodyType.Fixed)

  const floorBody = world.createRigidBody(floorBodyDesc)
  const floorColliderDesc = RAPIER.ColliderDesc.cuboid(2.5, 0.125, 2.5)
  floorBody.setTranslation({ x: 2.5, y: 0, z: 2.5 })
  floor.position.set(2.5, 0, 2.5)
  const floorCollider = world.createCollider(floorColliderDesc, floorBody)

  const animate = (renderer, scene, camera) => {
    requestAnimationFrame(() => animate(renderer, scene, camera))
    renderer.render(scene, camera)
    world.step()
    const rigidBodyPosition = rigidBody.translation()
    sampleMesh.position.set(rigidBodyPosition.x, rigidBodyPosition.y, rigidBodyPosition.z)
    const rigidBodyRotation = rigidBody.rotation()
    sampleMesh.rotation.setFromQuaternion(
      new THREE.Quaternion(rigidBodyRotation.x, rigidBodyRotation.y, rigidBodyRotation.z, rigidBodyRotation.w)
    )
  }

  bootstrapMeshScene({
    initializeScene: (scene) => {
      scene.add(sampleMesh)
      scene.add(floor)
    },
    addControls: (camera, renderer) => {
      new OrbitControls(camera, renderer.domElement)
    },
    animate: (renderer, scene, camera) => {
      animate(renderer, scene, camera)
    }
  }).then()
})
