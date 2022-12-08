import { bootstrapMeshScene } from './util/standard-scene-empty'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as THREE from 'three'
import { RigidBodyType } from '@dimforge/rapier3d'
import { Group } from 'three'

import('@dimforge/rapier3d').then((RAPIER) => {
  const gravity = { x: 0.0, y: 0.0, z: 0.0 }
  const world = new RAPIER.World(gravity)

  const animate = (renderer, scene, camera) => {
    requestAnimationFrame(() => animate(renderer, scene, camera))
    renderer.render(scene, camera)
    world.step()
    const jointMesh = scene.getObjectByName('jointBoxMesh')
    const rigidBody = jointMesh.userData.rigidBody
    const rigidBodyPosition = rigidBody.translation()
    const rigidBodyRotation = rigidBody.rotation()
    jointMesh.position.set(rigidBodyPosition.x, rigidBodyPosition.y, rigidBodyPosition.z)
    jointMesh.rotation.setFromQuaternion(
      new THREE.Quaternion(rigidBodyRotation.x, rigidBodyRotation.y, rigidBodyRotation.z, rigidBodyRotation.w)
    )

    const dropMesh = scene.getObjectByName('dropBoxMesh')
    const dropRigidBody = dropMesh.userData.rigidBody
    const dropRigidBodyPosition = dropRigidBody.translation()
    const dropRigidBodyRotation = dropRigidBody.rotation()
    dropMesh.position.set(dropRigidBodyPosition.x, dropRigidBodyPosition.y, dropRigidBodyPosition.z)
    dropMesh.rotation.setFromQuaternion(
      new THREE.Quaternion(
        dropRigidBodyRotation.x,
        dropRigidBodyRotation.y,
        dropRigidBodyRotation.z,
        dropRigidBodyRotation.w
      )
    )
  }

  const createFixedBox = () => {
    const fixedBox = new THREE.BoxGeometry(1, 1, 1)
    const fixedBoxMesh = new THREE.Mesh(fixedBox, new THREE.MeshStandardMaterial(0xffff00))
    const bodyDesc = new RAPIER.RigidBodyDesc(RigidBodyType.Fixed)
    const body = world.createRigidBody(bodyDesc)
    const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
    const collider = world.createCollider(colliderDesc, body)
    fixedBoxMesh.userData.rigidBody = body
    fixedBoxMesh.userData.collider = collider
    fixedBoxMesh.name = 'fixedBoxMesh'
    return fixedBoxMesh
  }

  const createJointBox = () => {
    const jointBox = new THREE.BoxGeometry(0.5, 0.1, 4)
    const jointBoxMesh = new THREE.Mesh(jointBox, new THREE.MeshStandardMaterial({ color: 0x33ff55 }))
    jointBoxMesh.translateX(-1)
    const bodyDesc = new RAPIER.RigidBodyDesc(RigidBodyType.Dynamic)
      .setCanSleep(false)
      .setTranslation(-1, 0, 0)
      .setAngularDamping(0.1)
    const body = world.createRigidBody(bodyDesc)
    const colliderDesc = RAPIER.ColliderDesc.cuboid(0.25, 0.05, 2)
    const collider = world.createCollider(colliderDesc, body)
    jointBoxMesh.userData.rigidBody = body
    jointBoxMesh.userData.collider = collider
    jointBoxMesh.name = 'jointBoxMesh'
    return jointBoxMesh
  }

  const createDropBox = () => {
    const dropBox = new THREE.BoxGeometry(0.2, 0.2, 0.2)
    const dropBoxMesh = new THREE.Mesh(dropBox, new THREE.MeshStandardMaterial({ color: 0xff33aa }))
    dropBoxMesh.translateX(-1)
    dropBoxMesh.translateY(1)
    dropBoxMesh.translateZ(1)
    const bodyDesc = new RAPIER.RigidBodyDesc(RigidBodyType.Dynamic).setCanSleep(false).setTranslation(-1, 1, 1)
    const body = world.createRigidBody(bodyDesc)
    const colliderDesc = RAPIER.ColliderDesc.cuboid(0.1, 0.1, 0.1)
    const collider = world.createCollider(colliderDesc, body)
    dropBoxMesh.userData.rigidBody = body
    dropBoxMesh.userData.collider = collider
    dropBoxMesh.name = 'dropBoxMesh'
    return dropBoxMesh
  }

  const setupScene = (scene) => {
    const fixedBox = createFixedBox()
    const jointBox = createJointBox()
    const dropBox = createDropBox()

    const fixedBody = fixedBox.userData.rigidBody
    const jointBody = jointBox.userData.rigidBody

    const params = RAPIER.JointData.revolute({ x: 0.0, y: 0.0, z: 0 }, { x: 1.0, y: 0.0, z: 0.0 }, { x: 1, y: 0, z: 0 })
    let joint = world.createImpulseJoint(params, fixedBody, jointBody, true)

    scene.add(fixedBox)
    scene.add(jointBox)
    scene.add(dropBox)
  }

  bootstrapMeshScene({
    initializeScene: setupScene,
    addControls: (camera, renderer, scene, gui) => {
      camera.position.set(-1.5, 4, -4)
      const gravityFolder = gui.addFolder('Gravity')
      gravityFolder.add(gravity, 'x', -10, 10, 0.1)
      gravityFolder.add(gravity, 'y', -10, 10, 0.1)
      gravityFolder.add(gravity, 'z', -10, 10, 0.1)

      new OrbitControls(camera, renderer.domElement)
    },
    animate: (renderer, scene, camera) => {
      animate(renderer, scene, camera)
    }
  }).then()
})
