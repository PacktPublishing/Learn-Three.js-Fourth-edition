import { bootstrapMeshScene } from './util/standard-scene-empty'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as THREE from 'three'
import { RigidBodyDesc, RigidBodyType } from '@dimforge/rapier3d'
import { floatingFloor, foreverPlane } from '../../bootstrap/floor'
import { Group, Quaternion } from 'three'
import GUI from 'lil-gui'

import('@dimforge/rapier3d').then((RAPIER) => {
  const gravity = { x: 0.0, y: -10.0, z: 0.0 }
  const world = new RAPIER.World(gravity)

  let currentRotation = 0
  let currentRotationDirection = 1
  const animate = (renderer, scene, camera) => {
    requestAnimationFrame(() => animate(renderer, scene, camera))
    renderer.render(scene, camera)
    const arena = scene.getObjectByName('arena')
    const arenaRigidBody = arena.userData.rigidBody

    // update the rotation of the rigidbody
    currentRotation += 0.005 * currentRotationDirection
    if (currentRotation > 0.6) currentRotationDirection = -1
    if (currentRotation < -0.6) currentRotationDirection = 1
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(currentRotation, 0, 0))
    arenaRigidBody.setRotation(q)

    // update the rotation of the assigned group
    const position = arenaRigidBody.translation()
    const rotation = arenaRigidBody.rotation()
    arena.position.set(position.x, position.y, position.z)
    arena.rotation.setFromQuaternion(new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w))

    // get the group containing all the objects
    scene.getObjectByName('addedMeshes').children.forEach((child) => {
      const childRigidBody = child.userData.rigidBody
      const position = childRigidBody.translation()
      const rotation = childRigidBody.rotation()

      child.position.set(position.x, position.y, position.z)
      child.rotation.setFromQuaternion(new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w))
    })

    world.step()
  }

  const setupScene = (scene) => {
    const arena = createArena()
    const mainFloorRigidBodyDesc = new RAPIER.RigidBodyDesc(RigidBodyType.KinematicPositionBased).setTranslation(
      arena.position.x,
      arena.position.y,
      arena.position.z
    )

    const arenaRigidBody = world.createRigidBody(mainFloorRigidBodyDesc)

    arena.userData.rigidBody = arenaRigidBody
    arena.children.forEach((floor) => rapierFloor(floor, arenaRigidBody))
    scene.add(arena)
  }

  const addRapierCube = (group, friction, restitution) => {
    const cubeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.4, 0.4),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(Math.random(), 0.4, 0.1) })
    )
    cubeMesh.name = 'sample'
    cubeMesh.position.set(0, 4, 0)
    cubeMesh.castShadow = true

    const rigidBodyDesc = new RAPIER.RigidBodyDesc(RigidBodyType.Dynamic)
      .setTranslation(0.0, 4, 0)
      .setCanSleep(false)
      .setCcdEnabled(false)
    const rigidBody = world.createRigidBody(rigidBodyDesc)

    const rigidBodyColliderDesc = RAPIER.ColliderDesc.cuboid(0.2, 0.2, 0.2)
    const rigidBodyCollider = world.createCollider(rigidBodyColliderDesc, rigidBody)

    console.log(restitution)
    console.log(friction)

    rigidBodyCollider.setRestitution(restitution)
    rigidBodyCollider.setFriction(friction)

    cubeMesh.userData.rigidBody = rigidBody
    cubeMesh.userData.collider = rigidBodyCollider

    group.add(cubeMesh)
  }

  const addRapierSphere = (group, friction, restitution) => {
    const sphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 6, 6),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(0.4, 0.4, Math.random()) })
    )
    sphereMesh.castShadow = true
    sphereMesh.name = 'sample'
    sphereMesh.position.set(0, 4, 0)

    const rigidBodyDesc = new RAPIER.RigidBodyDesc(RigidBodyType.Dynamic)
      .setTranslation(0.0, 4, 0)
      .setCanSleep(false)
      .setCcdEnabled(false)
    const rigidBody = world.createRigidBody(rigidBodyDesc)

    const rigidBodyColliderDesc = RAPIER.ColliderDesc.ball(0.2)
    const rigidBodyCollider = world.createCollider(rigidBodyColliderDesc, rigidBody)
    rigidBodyCollider.setRestitution(restitution)
    rigidBodyCollider.setFriction(friction)

    sphereMesh.userData.rigidBody = rigidBody
    sphereMesh.userData.collider = rigidBodyCollider

    group.add(sphereMesh)
  }

  const rapierFloor = (mesh, arenaRigidBody) => {
    const floorPosition = mesh.position

    const geometryParameters = mesh.geometry.parameters
    const floorColliderDesc = RAPIER.ColliderDesc.cuboid(
      geometryParameters.width / 2,
      geometryParameters.height / 2,
      geometryParameters.depth / 2
    ).setTranslation(floorPosition.x, floorPosition.y, floorPosition.z)

    const floorCollider = world.createCollider(floorColliderDesc, arenaRigidBody)
    mesh.userData.rigidBody = arenaRigidBody
    mesh.userData.collider = floorCollider
  }

  const createArena = () => {
    const textureLoader = new THREE.TextureLoader()
    const ground_material = new THREE.MeshStandardMaterial({
      map: textureLoader.load('/assets/textures/wood/floor-parquet-pattern-172292.jpg')
    })

    const arena = new THREE.Group()
    arena.name = 'arena'
    const ground = new THREE.Mesh(new THREE.BoxGeometry(6, 0.2, 10), ground_material)
    ground.castShadow = true
    ground.receiveShadow = true
    arena.add(ground)

    const borderLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.3, 10), ground_material)
    borderLeft.position.x = -3.1
    borderLeft.position.y = 0.2
    borderLeft.castShadow = true
    borderLeft.receiveShadow = true
    arena.add(borderLeft)

    const borderRight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.3, 10), ground_material)
    borderRight.position.x = 3.1
    borderRight.position.y = 0.2
    borderRight.castShadow = true
    borderRight.receiveShadow = true
    arena.add(borderRight)

    const borderBottom = new THREE.Mesh(new THREE.BoxGeometry(6.4, 2.3, 0.2), ground_material)
    borderBottom.position.z = 5
    borderBottom.position.y = 0.2
    borderBottom.castShadow = true
    borderBottom.receiveShadow = true
    arena.add(borderBottom)

    const borderTop = new THREE.Mesh(new THREE.BoxGeometry(6.4, 2.3, 0.2), ground_material)
    borderTop.position.z = -5
    borderTop.position.y = 0.22
    borderTop.castShadow = true
    borderTop.receiveShadow = true
    arena.add(borderTop)

    return arena
  }

  bootstrapMeshScene({
    initializeScene: setupScene,
    addControls: (camera, renderer, scene, gui) => {
      const group = new THREE.Group()
      group.name = 'addedMeshes'
      scene.add(group)

      camera.position.set(-0.5, 6, -10)
      const gravityFolder = gui.addFolder('Gravity')
      gravityFolder.add(gravity, 'x', -10, 10, 0.1)
      gravityFolder.add(gravity, 'y', -10, 10, 0.1)
      gravityFolder.add(gravity, 'z', -10, 10, 0.1)

      const sphereControls = {
        friction: 0.5,
        restitution: 0.5,
        addSphere: () => {
          addRapierSphere(group, sphereControls.friction, sphereControls.restitution)
        }
      }
      const sphereFolder = gui.addFolder('Sphere Settings')
      sphereFolder.add(sphereControls, 'friction', 0, 5, 0.01)
      sphereFolder.add(sphereControls, 'restitution', 0, 5, 0.01)
      sphereFolder.add(sphereControls, 'addSphere')

      const cubeControls = {
        friction: 0.5,
        restitution: 0.5,
        addCube: () => {
          addRapierCube(group, cubeControls.friction, cubeControls.restitution)
        }
      }
      const cubeFolder = gui.addFolder('Cube Settings')
      cubeFolder.add(cubeControls, 'friction', 0, 5, 0.01)
      cubeFolder.add(cubeControls, 'restitution', 0, 5, 0.01)
      cubeFolder.add(cubeControls, 'addCube')

      new OrbitControls(camera, renderer.domElement)
    },
    animate: (renderer, scene, camera) => {
      animate(renderer, scene, camera)
    }
  }).then()
})
