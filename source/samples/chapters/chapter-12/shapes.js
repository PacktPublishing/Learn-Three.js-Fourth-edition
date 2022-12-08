import { bootstrapMeshScene } from './util/standard-scene-empty'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as THREE from 'three'
import { RigidBodyDesc, RigidBodyType } from '@dimforge/rapier3d'
import { floatingFloor, foreverPlane } from '../../bootstrap/floor'
import { DoubleSide, Group, Quaternion } from 'three'
import GUI from 'lil-gui'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry'
import generator from 'perlin'

import('@dimforge/rapier3d').then((RAPIER) => {
  const gravity = { x: 0.0, y: -10.0, z: 0.0 }
  const world = new RAPIER.World(gravity)

  const animate = (renderer, scene, camera) => {
    requestAnimationFrame(() => animate(renderer, scene, camera))
    renderer.render(scene, camera)

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

  const setupScene = (scene) => {}

  const addRapierCube = (group, friction, restitution) => {
    const cubeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.4, 0.4),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(Math.random(), 0.4, 0.1) })
    )
    cubeMesh.position.set(0, 4, 0)
    cubeMesh.castShadow = true

    const rigidBodyDesc = new RAPIER.RigidBodyDesc(RigidBodyType.Dynamic)
      .setTranslation(0.0, 4, 0)
      .setCanSleep(false)
      .setCcdEnabled(false)
    const rigidBody = world.createRigidBody(rigidBodyDesc)

    const rigidBodyColliderDesc = RAPIER.ColliderDesc.cuboid(0.2, 0.2, 0.2)
    const rigidBodyCollider = world.createCollider(rigidBodyColliderDesc, rigidBody)

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

  const addRapierCylinder = (group, friction, restitution) => {
    const cylinderMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.6),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(0.9, 0.2, Math.random()) })
    )
    cylinderMesh.castShadow = true
    cylinderMesh.position.set(0, 4, 0)

    const rigidBodyDesc = new RAPIER.RigidBodyDesc(RigidBodyType.Dynamic)
      .setTranslation(0.0, 4, 0)
      .setCanSleep(false)
      .setCcdEnabled(false)
    const rigidBody = world.createRigidBody(rigidBodyDesc)

    const rigidBodyColliderDesc = RAPIER.ColliderDesc.cylinder(0.3, 0.2)
    const rigidBodyCollider = world.createCollider(rigidBodyColliderDesc, rigidBody)
    rigidBodyCollider.setRestitution(restitution)
    rigidBodyCollider.setFriction(friction)

    cylinderMesh.userData.rigidBody = rigidBody
    cylinderMesh.userData.collider = rigidBodyCollider

    group.add(cylinderMesh)
  }

  const addRapierCone = (group, friction, restitution) => {
    const coneMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0, 0.2, 0.6),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(0.2, 0.9, Math.random()) })
    )
    coneMesh.castShadow = true
    coneMesh.position.set(0, 4, 0)

    const rigidBodyDesc = new RAPIER.RigidBodyDesc(RigidBodyType.Dynamic)
      .setTranslation(0.0, 4, 0)
      .setCanSleep(false)
      .setCcdEnabled(false)
    const rigidBody = world.createRigidBody(rigidBodyDesc)

    const rigidBodyColliderDesc = RAPIER.ColliderDesc.cone(0.3, 0.2)
    const rigidBodyCollider = world.createCollider(rigidBodyColliderDesc, rigidBody)
    rigidBodyCollider.setRestitution(restitution)
    rigidBodyCollider.setFriction(friction)

    coneMesh.userData.rigidBody = rigidBody
    coneMesh.userData.collider = rigidBodyCollider

    group.add(coneMesh)
  }

  const addRapierCapsule = (group, friction, restitution) => {
    const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.4, 0.4, Math.random()) })

    const merged = new THREE.Group()
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.6), mat)
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.2), mat)
    top.translateY(0.3)
    const bot = new THREE.Mesh(new THREE.SphereGeometry(0.2), mat)
    bot.translateY(-0.3)
    cyl.castShadow = true
    top.castShadow = true
    bot.castShadow = true
    merged.add(cyl)
    merged.add(top)
    merged.add(bot)

    const rigidBodyDesc = new RAPIER.RigidBodyDesc(RigidBodyType.Dynamic)
      .setTranslation(0.0, 4, 0)
      .setCanSleep(false)
      .setCcdEnabled(false)
    const rigidBody = world.createRigidBody(rigidBodyDesc)

    const rigidBodyColliderDesc = RAPIER.ColliderDesc.capsule(0, 0.3, 0.2)
    const rigidBodyCollider = world.createCollider(rigidBodyColliderDesc, rigidBody)
    rigidBodyCollider.setRestitution(restitution)
    rigidBodyCollider.setFriction(friction)

    merged.userData.rigidBody = rigidBody
    merged.userData.collider = rigidBodyCollider

    group.add(merged)
  }

  const addRapierConvex = (group, friction, restitution) => {
    const generatePoints = () => {
      const spGroup = new THREE.Object3D()
      spGroup.name = 'spGroup'
      const points = []

      for (let i = 0; i < 30; i++) {
        const randomX = -0.5 + Math.random()
        const randomY = -0.5 + Math.random()
        const randomZ = -0.5 + Math.random()
        points.push(new THREE.Vector3(randomX, randomY, randomZ))
      }
      return points
    }
    const points = generatePoints()

    const convexGeometry = new ConvexGeometry(points)
    const convexMesh = new THREE.Mesh(
      convexGeometry,
      new THREE.MeshStandardMaterial({ color: new THREE.Color(Math.random(), 0.9, 0.2) })
    )

    convexMesh.castShadow = true
    convexMesh.position.set(0, 4, 0)

    const rigidBodyDesc = new RAPIER.RigidBodyDesc(RigidBodyType.Dynamic)
      .setTranslation(0.0, 4, 0)
      .setCanSleep(false)
      .setCcdEnabled(false)
    const rigidBody = world.createRigidBody(rigidBodyDesc)

    const rigidBodyColliderDesc = RAPIER.ColliderDesc.convexHull(convexGeometry.getAttribute('position').array)
    const rigidBodyCollider = world.createCollider(rigidBodyColliderDesc, rigidBody)
    rigidBodyCollider.setRestitution(restitution)
    rigidBodyCollider.setFriction(friction)

    convexMesh.userData.rigidBody = rigidBody
    convexMesh.userData.collider = rigidBodyCollider

    group.add(convexMesh)
  }

  const createHeightMap = () => {
    const width = 20
    const height = 20

    const points = []
    for (let x = 1; x <= width * 2; x++) {
      for (let y = 1; y <= height * 2; y++) {
        const v1 = generator.noise.perlin3(255 / x, 255 / y, 255 / (x * y))
        points.push(v1)
      }
    }

    const planeBufferGeometry = new THREE.PlaneGeometry(width, height, width * 2 - 1, height * 2 - 1)
    const floats = planeBufferGeometry.getAttribute('position').array

    points.forEach((point, index) => {
      floats[index * 3 + 2] = point
    })

    planeBufferGeometry.computeVertexNormals()
    const texture = new THREE.TextureLoader().load('/assets/textures/wood/abstract-antique-backdrop-164005.jpg')
    const heightMesh = new THREE.Mesh(
      planeBufferGeometry,
      new THREE.MeshStandardMaterial({ side: DoubleSide, color: 0xffffff, flatShading: false, map: texture })
    )
    heightMesh.translateY(0)
    heightMesh.rotateX(-0.5 * Math.PI - 0.5)
    heightMesh.receiveShadow = true
    heightMesh.castShadow = true

    const rapierArray = new Float32Array(width * 2 * height * 2)
    for (let x = 0; x < width * 2; x++) {
      for (let y = 0; y < height * 2; y++) {
        rapierArray[y * width * 2 + x] = floats[(x * height * 2 + y) * 3 + 2]
      }
    }

    const rigidBodyDesc = new RAPIER.RigidBodyDesc(RigidBodyType.Fixed)
      .setTranslation(0.0, 0, 0)
      .setCanSleep(false)
      .setCcdEnabled(false)
      .setRotation(new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.5, 0, 0)))
    const rigidBody = world.createRigidBody(rigidBodyDesc)
    const rigidBodyColliderDesc = RAPIER.ColliderDesc.heightfield(height * 2 - 1, width * 2 - 1, rapierArray, {
      x: width,
      y: 1,
      z: height
    })
    const collider = world.createCollider(rigidBodyColliderDesc, rigidBody)

    heightMesh.userData.rigidBody = rigidBody
    heightMesh.userData.collider = collider
    return heightMesh
  }

  bootstrapMeshScene({
    initializeScene: setupScene,
    addControls: (camera, renderer, scene, gui) => {
      const heightMesh = createHeightMap()
      scene.add(heightMesh)

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

      const capsuleControls = {
        friction: 0.5,
        restitution: 0.5,
        addCapsule: () => {
          addRapierCapsule(group, capsuleControls.friction, capsuleControls.restitution)
        }
      }
      const capsuleFolder = gui.addFolder('Capsule Settings')
      capsuleFolder.add(capsuleControls, 'friction', 0, 5, 0.01)
      capsuleFolder.add(capsuleControls, 'restitution', 0, 5, 0.01)
      capsuleFolder.add(capsuleControls, 'addCapsule')

      const cylinderControls = {
        friction: 0.5,
        restitution: 0.5,
        addCylinder: () => {
          addRapierCylinder(group, capsuleControls.friction, capsuleControls.restitution)
        }
      }
      const cylinderFolder = gui.addFolder('Cylinder Settings')
      cylinderFolder.add(cylinderControls, 'friction', 0, 5, 0.01)
      cylinderFolder.add(cylinderControls, 'restitution', 0, 5, 0.01)
      cylinderFolder.add(cylinderControls, 'addCylinder')

      const coneControls = {
        friction: 0.5,
        restitution: 0.5,
        addCone: () => {
          addRapierCone(group, coneControls.friction, coneControls.restitution)
        }
      }
      const coneFolder = gui.addFolder('Cone Settings')
      coneFolder.add(coneControls, 'friction', 0, 5, 0.01)
      coneFolder.add(coneControls, 'restitution', 0, 5, 0.01)
      coneFolder.add(coneControls, 'addCone')

      const convexControls = {
        friction: 0.5,
        restitution: 0.5,
        addConvex: () => {
          addRapierConvex(group, convexControls.friction, convexControls.restitution)
        }
      }
      const convexFolder = gui.addFolder('Convex Settings')
      convexFolder.add(convexControls, 'friction', 0, 5, 0.01)
      convexFolder.add(convexControls, 'restitution', 0, 5, 0.01)
      convexFolder.add(convexControls, 'addConvex')

      new OrbitControls(camera, renderer.domElement)
    },
    animate: (renderer, scene, camera) => {
      animate(renderer, scene, camera)
    }
  }).then()
})
