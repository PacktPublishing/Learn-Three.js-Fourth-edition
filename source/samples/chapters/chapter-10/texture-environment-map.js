import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeGuiMeshPhongMaterial } from '../../controls/material-controls'

const cubeMapFlowers = new THREE.CubeTextureLoader().load([
  '/assets/textures/cubemap/flowers/right.png',
  '/assets/textures/cubemap/flowers/left.png',
  '/assets/textures/cubemap/flowers/top.png',
  '/assets/textures/cubemap/flowers/bottom.png',
  '/assets/textures/cubemap/flowers/front.png',
  '/assets/textures/cubemap/flowers/back.png'
])

const cubeMapColloseum = new THREE.CubeTextureLoader().load([
  '/assets/textures/cubemap/colloseum/right.png',
  '/assets/textures/cubemap/colloseum/left.png',
  '/assets/textures/cubemap/colloseum/top.png',
  '/assets/textures/cubemap/colloseum/bottom.png',
  '/assets/textures/cubemap/colloseum/front.png',
  '/assets/textures/cubemap/colloseum/back.png'
])

const cubeMapCar = new THREE.CubeTextureLoader().load([
  '/assets/textures/cubemap/car/right.png',
  '/assets/textures/cubemap/car/left.png',
  '/assets/textures/cubemap/car/top.png',
  '/assets/textures/cubemap/car/bottom.png',
  '/assets/textures/cubemap/car/front.png',
  '/assets/textures/cubemap/car/back.png'
])

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
  generateMipmaps: true,
  minFilter: THREE.LinearMipmapLinearFilter
})

const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRenderTarget)

const cubeMapEqui = new THREE.TextureLoader().load('/assets/equi.jpeg', (loaded) => {
  loaded.mapping = THREE.EquirectangularReflectionMapping
})

const props = {
  material: new THREE.MeshPhongMaterial({ color: 0x777777 }),
  withMaterialGui: true,
  provideGui: (gui, mesh, material, scene, renderer) => {
    initializeGuiMeshPhongMaterial(gui, mesh, material)

    cubeCamera.update(renderer, scene)
    cubeCamera.position.copy(mesh.position)

    const maps = {
      flowers: cubeMapFlowers,
      colloseum: cubeMapColloseum,
      car: cubeMapCar,
      equi: cubeMapEqui
    }

    const envMapType = {
      reflectionEqui: THREE.EquirectangularReflectionMapping,
      refractionEqui: THREE.EquirectangularRefractionMapping,
      reflectionCube: THREE.CubeReflectionMapping,
      refractionCube: THREE.CubeRefractionMapping
    }

    const props = {
      cubeMap: cubeMapColloseum,
      envMapType: envMapType.reflectionCube,
      addCube: () => {
        const cube = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshStandardMaterial({ color: 0xfffff * Math.random() })
        )
        cube.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5)
        scene.add(cube)
      },
      updateCubeCamera: () => {
        mesh.visible = false
        mesh.material.envMap = cubeRenderTarget.texture
        mesh.material.envMap.mapping = props.envMapType
        cubeCamera.update(renderer, scene)
        mesh.visible = true
      }
    }

    const updateMap = (envMap, mapping) => {
      mesh.material.envMap = envMap
      envMap.mapping = mapping
      envMap.needsUpdate = true
      mesh.material.needsUpdate = true

      scene.background = envMap
    }

    const folder = gui.addFolder('Cubemaps')
    folder.add(props, 'envMapType', envMapType).onChange(() => updateMap(props.cubeMap, props.envMapType))
    folder.add(props, 'cubeMap', maps).onChange(() => updateMap(props.cubeMap, props.envMapType))
    folder.add(props, 'addCube')
    folder.add(props, 'updateCubeCamera')

    updateMap(props.cubeMap, props.envMapType)
  }
}

bootstrapMaterialScene(props).then()
