import * as THREE from 'three'
import { onResize } from './util/update-on-resize'
// import { checkWebGL } from './util/webgl-check'
import { AmbientLight, BoxGeometry, DirectionalLight, Object3D, PMREMGenerator, TextureLoader } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// checkWebGL()

const textureLoader = new THREE.TextureLoader()

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x222244)
scene.fog = new THREE.Fog(0x222244, 50, 100)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderConfig = { antialias: true, alpha: true }
const renderer = new THREE.WebGLRenderer(renderConfig)

renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.shadowMap.type = THREE.VSMShadowMap
renderer.setClearColor(0x89bbff, 1)

const pmremGenerator = new THREE.PMREMGenerator(renderer)
// pmremGenerator.compileEquirectangularShader()

onResize(camera, renderer)

const controls = new OrbitControls(camera, renderer.domElement)

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

camera.position.z = 10
camera.position.x = -3
camera.position.y = 5

addGroundPlane(scene)
addCar(scene)
addLighting(scene, camera)
controls.update()

function animate () {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
animate()

function addGroundPlane (scene) {
  let pngCubeRenderTarget
  const planeGeometry = new THREE.PlaneGeometry(200, 200)
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x999999,
    // shininess: 0,
    // reflectivity: 0.1,
    roughness: 0.1,
    metalness: 0.5
  })

  textureLoader.load('./assets/equi.jpeg', textureEquirec => {
    // textureEquirec.mapping = THREE.EquirectangularReflectionMapping
    // textureEquirec.encoding = THREE.sRGBEncoding
    // scene.background = textureEquirec
    // planeMaterial.envMap = textureEquirec
    pngCubeRenderTarget = pmremGenerator.fromEquirectangular(textureEquirec)
    console.log(pngCubeRenderTarget)
    planeMaterial.envMap = pngCubeRenderTarget.texture
    planeMaterial.needsUpdate = true
    scene.background = pngCubeRenderTarget.texture
  })

  const ground = new THREE.Mesh(planeGeometry, planeMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -3.45
  ground.scale.multiplyScalar(3)
  ground.castShadow = false
  ground.receiveShadow = true
  scene.add(ground)
}

function addCar (scene) {
  const loader = new GLTFLoader()
  loader.load('./assets/blender-truck-groups.glb', loadedObject => {
    for (const child of loadedObject.scene.children) {
      child.receiveShadow = true
      child.castShadow = true
      switch (child.name) {
        case 'CarBody':

          child.material.metalness = 0.9
          child.material.roughnesss = 0.2

          console.log(child.material)
          console.log(child)
          break
        default:
          break
      }
    }
    scene.add(loadedObject.scene)
  })
}

// function traverseChildren (object, fn) {
//   if (object.children && object.children.length > 0) {
//     for (const child of object.children) {
//       traverseChildren(child, fn)
//     }
//   } else {
//     fn(object)
//   }
// }

// function setAllMaterialProps (object, fn) {
//   if (object.material) {
//     fn(object.material)
//   } else {
//     if (object.children) {
//       for (const child of object.children) {
//         setAllMaterialProps(child, fn)
//       }
//     }
//   }
// }

function addLighting (scene, camera) {
  // const directionalLight1 = new THREE.PointLight(0xffffff, 0.8)
  // directionalLight1.position.set(10, 10, 10)
  // directionalLight1.lookAt(camera.lookAt)
  // directionalLight1.castShadow = true
  // scene.add(directionalLight1)
  // const directionalLight2 = new DirectionalLight(0xffffff, 0.4)
  // directionalLight2.position.copy(new THREE.Vector3(camera.position.x * -1, camera.position.y, camera.position.z))
  // directionalLight2.lookAt(camera.lookAt)
  // scene.add(directionalLight2)
  // // const directionalLight3 = new DirectionalLight(0xffffff, 0.1)
  // // directionalLight3.position.copy(new THREE.Vector3(camera.position.x * -1, camera.position.y, camera.position.z * -1))
  // // directionalLight3.lookAt(camera.lookAt)
  // // scene.add(directionalLight3)
  // const hemiLight = new THREE.HemisphereLight(0x4882ff, 0x502718, 0.7)
  // scene.add(hemiLight)

  // https://threejs.org/examples/?q=shado#webgl_shadowmap_vsm
  // rather nice lights
  scene.add(new THREE.AmbientLight(0x666666))

  const spotLight = new THREE.SpotLight(0xff8888)
  spotLight.angle = Math.PI / 5
  spotLight.penumbra = 0.3
  spotLight.position.set(8, 10, 5)
  spotLight.castShadow = true
  spotLight.shadow.camera.near = 8
  spotLight.shadow.camera.far = 200
  spotLight.shadow.mapSize.width = 256
  spotLight.shadow.mapSize.height = 256
  spotLight.shadow.bias = -0.002
  spotLight.shadow.radius = 4
  scene.add(spotLight)

  const dirLight = new THREE.DirectionalLight(0x8888ff)
  dirLight.position.set(5, 10, 8)
  dirLight.castShadow = true
  dirLight.shadow.camera.near = 0.1
  dirLight.shadow.camera.far = 500
  dirLight.shadow.camera.right = 17
  dirLight.shadow.camera.left = -17
  dirLight.shadow.camera.top = 17
  dirLight.shadow.camera.bottom = -17
  dirLight.shadow.mapSize.width = 512
  dirLight.shadow.mapSize.height = 512
  dirLight.shadow.radius = 4
  dirLight.shadow.bias = -0.0005

  scene.add(dirLight)
}
