import * as THREE from 'three'

export const initLighting = (scene, { disableShadows }) => {
  // https://threejs.org/examples/?q=shado#webgl_shadowmap_vsm
  scene.add(new THREE.AmbientLight(0x666666))

  // const dirLight = new THREE.DirectionalLight(0xaaaaaa)
  const dirLight = new THREE.DirectionalLight(0xaaaaaa)
  dirLight.position.set(5, 12, 8)
  dirLight.castShadow = !disableShadows ? true : false
  dirLight.intensity = 1
  dirLight.shadow.camera.near = 0.1
  dirLight.shadow.camera.far = 200
  dirLight.shadow.camera.right = 10
  dirLight.shadow.camera.left = -10
  dirLight.shadow.camera.top = 10
  dirLight.shadow.camera.bottom = -10
  dirLight.shadow.mapSize.width = 2048
  dirLight.shadow.mapSize.height = 2048
  dirLight.shadow.radius = 4
  dirLight.shadow.bias = -0.00005

  scene.add(dirLight)
}
