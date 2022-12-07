import { bootstrapMeshScene } from './util/standard-scene-empty'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as THREE from 'three'
import { RigidBodyType } from '@dimforge/rapier3d'
import { Group } from 'three'

import('@dimforge/rapier3d').then((RAPIER) => {
  const gravity = { x: 0.0, y: -5.0, z: 0.0 }
  const world = new RAPIER.World(gravity)

  const animate = (renderer, scene, camera) => {
    requestAnimationFrame(() => animate(renderer, scene, camera))
    renderer.render(scene, camera)
    world.step()
    const beadsGroup = scene.getObjectByName('beads')
    beadsGroup.children.forEach((bead) => {
      const beadRigidBody = bead.userData.rigidBody
      const position = beadRigidBody.translation()
      const rotation = beadRigidBody.rotation()
      bead.position.set(position.x, position.y, position.z)
      bead.rotation.setFromQuaternion(new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w))
    })
  }

  const setupScene = (scene) => {
    const beads = createBeads()
    beads.children[0].rotation.x = 0.2
    beads.children.forEach((bead) => rapierBead(bead))
    createChain(beads.children)
    scene.add(beads)
    createBar(scene)
  }

  const createBar = (scene) => {
    const cylinderMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 7, 100),
      new THREE.MeshStandardMaterial({ color: 0xff4444 })
    )
    cylinderMesh.castShadow = true
    cylinderMesh.position.set(0, 0, 0)
    cylinderMesh.rotation.x = 0.5 * Math.PI

    const rigidBodyDesc = new RAPIER.RigidBodyDesc(RigidBodyType.Fixed)
      .setTranslation(0.0, 0, 0)
      .setRotation(new THREE.Quaternion().setFromEuler(cylinderMesh.rotation))
      .setCanSleep(false)
      .setCcdEnabled(false)

    const rigidBody = world.createRigidBody(rigidBodyDesc)

    const rigidBodyColliderDesc = RAPIER.ColliderDesc.cylinder(3.5, 0.2).setFriction(0)
    const rigidBodyCollider = world.createCollider(rigidBodyColliderDesc, rigidBody)

    cylinderMesh.userData.rigidBody = rigidBody
    cylinderMesh.userData.collider = rigidBodyCollider

    scene.add(cylinderMesh)
  }

  const createChain = (beads) => {
    for (let i = 1; i < beads.length; i++) {
      const previousBead = beads[i - 1].userData.rigidBody
      const thisBead = beads[i].userData.rigidBody

      const positionPrevious = beads[i - 1].position
      const positionNext = beads[i].position

      const xOffset = Math.abs(positionNext.x - positionPrevious.x)
      const params = RAPIER.JointData.spherical({ x: 0, y: 0, z: 0 }, { x: xOffset, y: 0, z: 0 })
      world.createImpulseJoint(params, thisBead, previousBead, true)
    }
  }

  const rapierBead = (mesh) => {
    const beadPosition = mesh.position
    const beadRotationQuaternion = new THREE.Quaternion().setFromEuler(mesh.rotation)

    const beadBodyDescription = new RAPIER.RigidBodyDesc(RigidBodyType.Dynamic)
      .setTranslation(beadPosition.x, beadPosition.y, beadPosition.z)
      .setRotation({
        w: beadRotationQuaternion.w,
        x: beadRotationQuaternion.x,
        y: beadRotationQuaternion.y,
        z: beadRotationQuaternion.z
      })
      .setGravityScale(1)
      .setCanSleep(false)
      .setCcdEnabled(false)

    const beadRigidBody = world.createRigidBody(beadBodyDescription)
    const geometryParameters = mesh.geometry.parameters
    const beadColliderDesc = RAPIER.ColliderDesc.ball(geometryParameters.radius)
    const beadCollider = world.createCollider(beadColliderDesc, beadRigidBody)
    mesh.userData.rigidBody = beadRigidBody
    mesh.userData.collider = beadCollider
  }

  const createBeads = () => {
    const getPoints = () => {
      const points = []
      for (let i = 0; i < 50; i++) {
        const x = -4 + i / 7
        const z = 0
        const y = 2

        points.push(new THREE.Vector3(x, y, z))
      }

      return points
    }
    const beads = new Group()
    beads.name = 'beads'
    const points = getPoints()
    points.forEach((point, index) => {
      const colors = [0x66ff00, 0x6600ff]

      const beadGeom = new THREE.SphereGeometry(0.05)
      const bead = new THREE.Mesh(
        beadGeom,
        new THREE.MeshStandardMaterial({
          color: colors[index % colors.length],
          transparent: true,
          opacity: 0.8
        })
      )
      bead.position.copy(point)
      bead.position.y = 2
      bead.castShadow = true
      bead.receiveShadow = true

      beads.add(bead)
    })
    return beads
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
