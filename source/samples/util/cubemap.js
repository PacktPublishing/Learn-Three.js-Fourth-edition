import * as THREE from 'three'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'

const textureLoader = new THREE.TextureLoader()
const exrLoader = new EXRLoader()

export const premCubeMap = (renderer, onload) => {
  const pmremGenerator = new THREE.PMREMGenerator(renderer)
  let pngCubeRenderTarget

  textureLoader.load('/assets/equi.jpeg', textureEquirec => {
    pngCubeRenderTarget = pmremGenerator.fromEquirectangular(textureEquirec)
    onload(pngCubeRenderTarget.texture)
  })
}

export const exrCubeMap = (renderer, onload) => {
  const pmremGenerator = new THREE.PMREMGenerator(renderer)
  let pngCubeRenderTarget

  exrLoader.load('/assets/wide_street_01_2k.exr', textureEquirec => {
    pngCubeRenderTarget = pmremGenerator.fromEquirectangular(textureEquirec)
    onload(pngCubeRenderTarget.texture)
  })
}
