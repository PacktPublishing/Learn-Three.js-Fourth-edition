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

  const cubeMesh1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial())
  cubeMesh1.position.set(0, 4, 0)

  const cubeMesh2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial())
  cubeMesh2.position.set(2, 4, 0)

  const rigidBodyDesc1 = new RAPIER.RigidBodyDesc(RigidBodyType.Dynamic)
    .setTranslation(0.0, 4, 0)
    .setCanSleep(true)
    .setCcdEnabled(false)
  const rigidBodyDesc2 = new RAPIER.RigidBodyDesc(RigidBodyType.Dynamic)
    .setTranslation(2, 4, 0)
    .setCanSleep(true)
    .setCcdEnabled(false)

  const rigidBody1 = world.createRigidBody(rigidBodyDesc1)
  const rigidBody2 = world.createRigidBody(rigidBodyDesc2)

  const rigidBodyColliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
  const rigidBodyCollider1 = world.createCollider(rigidBodyColliderDesc, rigidBody1)
  const rigidBodyCollider2 = world.createCollider(rigidBodyColliderDesc, rigidBody2)

  rigidBodyCollider1.setRestitution(1)
  rigidBodyCollider2.setRestitution(1)

  let params = RAPIER.JointData.fixed(
    { x: 0.0, y: 0.0, z: 0.0 },
    { w: 1.0, x: 0.0, y: 0.0, z: 0.0 },
    { x: 2.0, y: 2.0, z: 2.0 },
    { w: 0.3, x: 1, y: 1, z: 1 }
  )
  world.createImpulseJoint(params, rigidBody1, rigidBody2, true)

  const floorBodyDesc = new RAPIER.RigidBodyDesc(RigidBodyType.Fixed)
  const floorBody = world.createRigidBody(floorBodyDesc)
  const floorColliderDesc = RAPIER.ColliderDesc.cuboid(2.5, 0.125, 2.5)
  floorBody.setTranslation({ x: 2.5, y: 0, z: 2.5 })
  floor.position.set(2.5, 0, 2.5)
  world.createCollider(floorColliderDesc, floorBody)

  const animate = (renderer, scene, camera) => {
    requestAnimationFrame(() => animate(renderer, scene, camera))
    renderer.render(scene, camera)
    world.step()
    const rigidBodyPosition1 = rigidBody1.translation()
    cubeMesh1.position.set(rigidBodyPosition1.x, rigidBodyPosition1.y, rigidBodyPosition1.z)
    const rigidBodyRotation1 = rigidBody1.rotation()
    cubeMesh1.rotation.setFromQuaternion(
      new THREE.Quaternion(rigidBodyRotation1.x, rigidBodyRotation1.y, rigidBodyRotation1.z, rigidBodyRotation1.w)
    )

    const rigidBodyPosition2 = rigidBody2.translation()
    cubeMesh2.position.set(rigidBodyPosition2.x, rigidBodyPosition2.y, rigidBodyPosition2.z)
    const rigidBodyRotation2 = rigidBody2.rotation()
    cubeMesh2.rotation.setFromQuaternion(
      new THREE.Quaternion(rigidBodyRotation2.x, rigidBodyRotation2.y, rigidBodyRotation2.z, rigidBodyRotation2.w)
    )
  }

  bootstrapMeshScene({
    initializeScene: (scene) => {
      scene.add(cubeMesh1)
      scene.add(cubeMesh2)
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
