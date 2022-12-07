import { bootstrapMeshScene } from './util/standard-scene-empty'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as THREE from 'three'
import { RigidBodyDesc, RigidBodyType } from '@dimforge/rapier3d'
import { floatingFloor, foreverPlane } from '../../bootstrap/floor'
import { Group, Quaternion } from 'three'
import GUI from 'lil-gui'

import('@dimforge/rapier3d').then((RAPIER) => {
  const gravity = { x: 0.0, y: 0.0, z: 0.0 }
  const world = new RAPIER.World(gravity)

  const animate = (renderer, scene, camera) => {
    requestAnimationFrame(() => animate(renderer, scene, camera))
    renderer.render(scene, camera)
    world.step()
    const dominosGroup = scene.getObjectByName('dominos')
    dominosGroup.children.forEach((domino) => {
      const dominoRigidBody = domino.userData.rigidBody
      const position = dominoRigidBody.translation()
      const rotation = dominoRigidBody.rotation()
      domino.position.set(position.x, position.y, position.z)
      domino.rotation.setFromQuaternion(new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w))
    })
  }

  const setupScene = (scene) => {
    scene.add(createArena())
    const dominos = createDominos()
    dominos.children[0].rotation.x = 0.2
    const floor = createArena()
    dominos.children.forEach((domino) => rapierDomino(domino))
    floor.children.forEach((floor) => rapierFloor(floor))
    scene.add(floor)
    scene.add(dominos)
  }

  const rapierFloor = (mesh) => {
    const floorPosition = mesh.position

    const floorBodyDescription = new RAPIER.RigidBodyDesc(RigidBodyType.Fixed).setTranslation(
      floorPosition.x,
      floorPosition.y,
      floorPosition.z
    )
    const floorRigidBody = world.createRigidBody(floorBodyDescription)
    const geometryParameters = mesh.geometry.parameters
    const floorColliderDesc = RAPIER.ColliderDesc.cuboid(
      geometryParameters.width / 2,
      geometryParameters.height / 2,
      geometryParameters.depth / 2
    )
    const floorCollider = world.createCollider(floorColliderDesc, floorRigidBody)
    mesh.userData.rigidBody = floorRigidBody
    mesh.userData.collider = floorCollider
  }

  const rapierDomino = (mesh) => {
    const stonePosition = mesh.position
    const stoneRotationQuaternion = new THREE.Quaternion().setFromEuler(mesh.rotation)

    const dominoBodyDescription = new RAPIER.RigidBodyDesc(RigidBodyType.Dynamic)
      .setTranslation(stonePosition.x, stonePosition.y, stonePosition.z)
      .setRotation({
        w: stoneRotationQuaternion.w,
        x: stoneRotationQuaternion.x,
        y: stoneRotationQuaternion.y,
        z: stoneRotationQuaternion.z
      })
      .setGravityScale(1)
      .setCanSleep(false)
      .setCcdEnabled(false)

    const dominoRigidBody = world.createRigidBody(dominoBodyDescription)
    const geometryParameters = mesh.geometry.parameters
    const dominoColliderDesc = RAPIER.ColliderDesc.cuboid(
      geometryParameters.width / 2,
      geometryParameters.height / 2,
      geometryParameters.depth / 2
    )
    const dominoCollider = world.createCollider(dominoColliderDesc, dominoRigidBody)
    mesh.userData.rigidBody = dominoRigidBody
    mesh.userData.collider = dominoCollider
  }

  const createArena = () => {
    const textureLoader = new THREE.TextureLoader()
    const ground_material = new THREE.MeshStandardMaterial({
      map: textureLoader.load('/assets/textures/wood/floor-parquet-pattern-172292.jpg')
    })

    const arena = new THREE.Group()
    arena.name = 'arena'
    const ground = new THREE.Mesh(new THREE.BoxGeometry(6, 0.2, 6), ground_material)
    ground.castShadow = true
    ground.receiveShadow = true
    arena.add(ground)

    const borderLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 6), ground_material)
    borderLeft.position.x = -3.1
    borderLeft.position.y = 0.2
    borderLeft.castShadow = true
    borderLeft.receiveShadow = true
    arena.add(borderLeft)

    const borderRight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 6), ground_material)
    borderRight.position.x = 3.1
    borderRight.position.y = 0.2
    borderRight.castShadow = true
    borderRight.receiveShadow = true
    arena.add(borderRight)

    const borderBottom = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.3, 0.2), ground_material)
    borderBottom.position.z = 3
    borderBottom.position.y = 0.2
    borderBottom.castShadow = true
    borderBottom.receiveShadow = true
    arena.add(borderBottom)

    const borderTop = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.3, 0.2), ground_material)
    borderTop.position.z = -3
    borderTop.position.y = 0.22
    borderTop.castShadow = true
    borderTop.receiveShadow = true
    arena.add(borderTop)

    return arena
  }

  const createDominos = () => {
    const getPoints = () => {
      const points = []
      const r = 2.8
      const cX = 0
      const cY = 0

      let circleOffset = 0
      for (let i = 0; i < 1200; i += 6 + circleOffset) {
        circleOffset = 1.5 * (i / 360)

        const x = (r / 1440) * (1440 - i) * Math.cos(i * (Math.PI / 180)) + cX
        const z = (r / 1440) * (1440 - i) * Math.sin(i * (Math.PI / 180)) + cY
        const y = 0

        points.push(new THREE.Vector3(x, y, z))
      }

      return points
    }
    const stones = new Group()
    stones.name = 'dominos'
    const points = getPoints()
    points.forEach((point, index) => {
      const colors = [0x66ff00, 0x6600ff]
      const stoneGeom = new THREE.BoxGeometry(0.05, 0.5, 0.2)
      const stone = new THREE.Mesh(
        stoneGeom,
        new THREE.MeshStandardMaterial({
          color: colors[index % colors.length],
          transparent: true,
          opacity: 0.8
        })
      )
      stone.position.copy(point)
      stone.lookAt(new THREE.Vector3(0, 0, 0))

      stone.position.y = 0.35
      stone.castShadow = true
      stone.receiveShadow = true

      stones.add(stone)
    })
    return stones
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
