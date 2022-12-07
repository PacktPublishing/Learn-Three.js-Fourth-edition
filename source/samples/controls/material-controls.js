// adopted from https://github.com/mrdoob/three.js/blob/a24e9803738ce7aa571e0cea6a858ed0078a1004/docs/scenes/material-browser.html
import * as THREE from 'three'
import { getObjectsKeys } from '../util/index.js'
import { visitChildren } from '../util/modelUtil.js'
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper'

const envMaps = (function () {
  const reflectionCube2 = new THREE.TextureLoader().load('/assets/equi.jpeg', (loaded) => {
    loaded.mapping = THREE.EquirectangularReflectionMapping
  })
  const refractionCube2 = new THREE.TextureLoader().load('/assets/equi.jpeg', (loaded) => {
    loaded.mapping = THREE.EquirectangularRefractionMapping
  })

  return {
    none: null,
    reflection: reflectionCube2,
    refraction: refractionCube2
  }
})()

const textureLoader = new THREE.TextureLoader()
const diffuseMaps = (function () {
  const parquet = textureLoader.load('/assets/textures/wood/floor-parquet-pattern-172292.jpg')
  parquet.encoding = THREE.sRGBEncoding
  parquet.wrapS = THREE.RepeatWrapping
  parquet.wrapT = THREE.RepeatWrapping
  parquet.repeat.set(9, 1)

  const antique = textureLoader.load('/assets/textures/wood/abstract-antique-backdrop-164005.jpg')
  antique.encoding = THREE.sRGBEncoding
  antique.wrapS = THREE.RepeatWrapping
  antique.wrapT = THREE.RepeatWrapping
  antique.repeat.set(9, 1)

  const marble = textureLoader.load('/assets/textures/marble/marble_0008_color_2k.jpg')
  marble.encoding = THREE.sRGBEncoding
  marble.wrapS = THREE.RepeatWrapping
  marble.wrapT = THREE.RepeatWrapping

  const ground = textureLoader.load('/assets/textures/ground/ground_0036_color_1k.jpg')
  marble.encoding = THREE.sRGBEncoding
  marble.wrapS = THREE.RepeatWrapping
  marble.wrapT = THREE.RepeatWrapping

  return {
    none: null,
    floorAntique: antique,
    floorParquet: parquet,
    marble: marble,
    ground: ground
  }
})()

const envMapKeys = getObjectsKeys(envMaps)
const diffuseMapKeys = getObjectsKeys(diffuseMaps)

const constants = {
  combine: {
    'THREE.MultiplyOperation': THREE.MultiplyOperation,
    'THREE.MixOperation': THREE.MixOperation,
    'THREE.AddOperation': THREE.AddOperation
  },

  side: {
    'THREE.FrontSide': THREE.FrontSide,
    'THREE.BackSide': THREE.BackSide,
    'THREE.DoubleSide': THREE.DoubleSide
  },

  blendingMode: {
    'THREE.NoBlending': THREE.NoBlending,
    'THREE.NormalBlending': THREE.NormalBlending,
    'THREE.AdditiveBlending': THREE.AdditiveBlending,
    'THREE.SubtractiveBlending': THREE.SubtractiveBlending,
    'THREE.MultiplyBlending': THREE.MultiplyBlending,
    'THREE.CustomBlending': THREE.CustomBlending
  },

  equations: {
    'THREE.AddEquation': THREE.AddEquation,
    'THREE.SubtractEquation': THREE.SubtractEquation,
    'THREE.ReverseSubtractEquation': THREE.ReverseSubtractEquation
  },

  destinationFactors: {
    'THREE.ZeroFactor': THREE.ZeroFactor,
    'THREE.OneFactor': THREE.OneFactor,
    'THREE.SrcColorFactor': THREE.SrcColorFactor,
    'THREE.OneMinusSrcColorFactor': THREE.OneMinusSrcColorFactor,
    'THREE.SrcAlphaFactor': THREE.SrcAlphaFactor,
    'THREE.OneMinusSrcAlphaFactor': THREE.OneMinusSrcAlphaFactor,
    'THREE.DstAlphaFactor': THREE.DstAlphaFactor,
    'THREE.OneMinusDstAlphaFactor': THREE.OneMinusDstAlphaFactor
  },

  sourceFactors: {
    'THREE.DstColorFactor': THREE.DstColorFactor,
    'THREE.OneMinusDstColorFactor': THREE.OneMinusDstColorFactor,
    'THREE.SrcAlphaSaturateFactor': THREE.SrcAlphaSaturateFactor
  }
}

const handleColorChange = (color) => {
  return function (value) {
    if (typeof value === 'string') {
      value = value.replace('#', '0x')
    }

    color.setHex(value)
  }
}

const initializeGuiMaterial = (gui, mesh, material) => {
  const regex = /THREE.*Material/
  const toRemove = []
  gui.folders.map((f) => {
    if (
      regex.test(f._title) ||
      f._title === 'THREE.Material' ||
      f._title === 'THREE.MeshBasicMaterial' ||
      f._title === 'THREE.LineBasicMaterial' ||
      f._title === 'THREE.MeshNormalMaterial'
    ) {
      toRemove.push(f)
    }
  })
  for (const p of toRemove) p.destroy()

  const folder = gui.addFolder('THREE.Material')

  folder.add(material, 'transparent').onChange(needsUpdate(material, mesh))
  folder.add(material, 'opacity', 0, 1).step(0.01)
  folder.add(material, 'blending', constants.blendingMode)
  folder.add(material, 'blendSrc', constants.destinationFactors)
  folder.add(material, 'blendDst', constants.destinationFactors)
  folder.add(material, 'blendEquation', constants.equations)
  folder.add(material, 'depthTest')
  folder.add(material, 'depthWrite')

  // Probably to complex to enable
  // folder.add( material, 'polygonOffset' );
  // folder.add( material, 'polygonOffsetFactor' );
  // folder.add( material, 'polygonOffsetUnits' );

  folder.add(material, 'alphaTest', 0, 1).step(0.01).onChange(needsUpdate(material, mesh))
  folder.add(material, 'visible')
  folder.add(material, 'side', constants.side).onChange(needsUpdate(material, mesh))

  return folder
}

export const initializeMeshDepthMaterial = (gui, mesh, material) => {
  const folder = gui.addFolder('THREE.MeshDepthMaterial')
  folder.add(material, 'wireframe')
}

export const initializeMeshNormalMaterial = (gui, mesh, material, scene) => {
  const props = {
    vertexHelpers: false
  }

  for (const child of scene.children) {
    if (child.name === 'VertexNormalHelper') scene.remove(child)
  }

  const folder = gui.addFolder('THREE.MeshNormalMaterial')
  folder.add(material, 'wireframe')
  folder.add(material, 'flatShading').onChange(needsUpdate(material, mesh))
  folder.add(props, 'vertexHelpers').onChange((enabled) => {
    if (enabled) {
      visitChildren(mesh, (c) => {
        const helper = new VertexNormalsHelper(c, 0.1)
        helper.name = 'VertexNormalHelper'
        scene.add(helper)
      })
    } else {
      for (const child of scene.children) {
        if (child.name === 'VertexNormalHelper') scene.remove(child)
      }
    }
  })
}

export const initializeGuiMeshLambertMaterial = (gui, mesh, material, title) => {
  const data = {
    color: material.color.getHex(),
    emissive: material.emissive.getHex(),
    envMaps: envMapKeys[0],
    map: diffuseMapKeys[0]
  }

  const folder = gui.addFolder(title ?? 'THREE.MeshLambertMaterial')
  folder.addColor(data, 'emissive').onChange(handleColorChange(material.emissive))
  folder.add(material, 'emissiveIntensity', 0, 3)
  addRecurringMaterialProps(folder, data, material, mesh)
}

export const initializeGuiMeshPhongMaterial = (gui, mesh, material, title) => {
  const data = {
    color: material.color.getHex(),
    emissive: material.emissive.getHex(),
    specular: material.specular.getHex(),
    envMaps: envMapKeys[0],
    map: diffuseMapKeys[0]
  }

  const folder = gui.addFolder(title ?? 'THREE.MeshPhongMaterial')
  folder.addColor(data, 'emissive').onChange(handleColorChange(material.emissive))
  folder.add(material, 'emissiveIntensity', 0, 3)
  folder.addColor(data, 'specular').onChange(handleColorChange(material.specular))
  folder.add(material, 'shininess', 0, 100)
  addRecurringMaterialProps(folder, data, material, mesh)
}

export const initializeGuiMeshPhysicalMaterial = (gui, mesh, material, title) => {
  const data = {
    color: material.color.getHex(),
    emissive: material.emissive.getHex(),
    envMaps: envMapKeys[0],
    map: diffuseMapKeys[0]
  }

  const folder = gui.addFolder(title ?? 'THREE.MeshPhysicalMaterial')
  folder.addColor(data, 'emissive').onChange(handleColorChange(material.emissive))
  folder.add(material, 'emissiveIntensity', 0, 3)
  folder.add(material, 'roughness', 0, 1)
  folder.add(material, 'metalness', 0, 1)
  folder.add(material, 'clearcoat', 0, 1)
  folder.add(material, 'clearcoatRoughness', 0, 1)
  addRecurringMaterialProps(folder, data, material, mesh)
}

export const initializeGuiMeshStandardMaterial = (gui, mesh, material, title) => {
  const data = {
    color: material.color.getHex(),
    emissive: material.emissive.getHex(),
    envMaps: envMapKeys[0],
    map: diffuseMapKeys[0]
  }

  const folder = gui.addFolder(title ?? 'THREE.MeshStandardMaterial')
  folder.addColor(data, 'emissive').onChange(handleColorChange(material.emissive))
  folder.add(material, 'emissiveIntensity', 0, 3)
  folder.add(material, 'roughness', 0, 1)
  folder.add(material, 'metalness', 0, 1)
  addRecurringMaterialProps(folder, data, material, mesh, {})

  return folder
}

export const initializeGuiMeshBasicMaterial = (gui, mesh, material, title) => {
  const data = {
    color: material.color.getHex(),
    envMaps: envMapKeys[0],
    map: diffuseMapKeys[0]
  }

  const folder = gui.addFolder(title ?? 'THREE.MeshBasicMaterial')
  addRecurringMaterialProps(folder, data, material, mesh, {})
}

export const initializeGuiLineBasicMaterial = (gui, mesh, material, title) => {
  const data = {
    color: material.color.getHex()
  }

  const folder = gui.addFolder(title ?? 'THREE.LineBasicMaterial')
  folder.addColor(data, 'color').onChange(handleColorChange(material.color))
  folder.add(material, 'vertexColors').onChange(needsUpdate(material, mesh))
  folder.add(material, 'linewidth', 0, 5, 0.1)
}

export const initializeGuiLineDashedMaterial = (gui, mesh, material, title) => {
  const data = {
    color: material.color.getHex()
  }

  const folder = gui.addFolder(title ?? 'THREE.LineDashedMaterial')
  folder.addColor(data, 'color').onChange(handleColorChange(material.color))
  folder.add(material, 'vertexColors').onChange(needsUpdate(material, mesh))
  folder.add(material, 'linewidth', 0, 5, 0.1)
  folder.add(material, 'scale', 0, 5, 0.1)
  folder.add(material, 'dashSize', 0, 5, 0.1)
  folder.add(material, 'gapSize', 0, 5, 0.1)
}

function addRecurringMaterialProps(folder, data, material, mesh, disableEnv) {
  folder.addColor(data, 'color').onChange(handleColorChange(material.color))
  folder.add(material, 'wireframe')
  folder.add(material, 'vertexColors').onChange(needsUpdate(material, mesh))
  if (disableEnv ?? true) {
    folder.add(data, 'envMaps', envMapKeys).onChange(updateTexture(material, 'envMap', envMaps))
    folder.add(data, 'map', diffuseMapKeys).onChange(updateTexture(material, 'map', diffuseMaps))
    folder.add(material, 'combine', constants.combine).onChange(updateCombine(material))
    if (material.reflectivity) folder.add(material, 'reflectivity', 0, 1)
    folder.add(material, 'refractionRatio', 0, 1)
  }
}

export const initializeGuiMeshToonMaterial = (gui, mesh, material, title) => {
  const data = {
    color: material.color.getHex(),
    envMaps: envMapKeys[0],
    map: diffuseMapKeys[0]
  }

  const folder = gui.addFolder(title ?? 'THREE.MeshToonMaterial')
  addRecurringMaterialProps(folder, data, material, mesh, false)
}

export const initializePointsMaterial = (gui, mesh, material, title) => {
  const data = {
    color: material.color.getHex(),
    size: 1,
    sizeAttenuation: false,
    vertexColors: true
  }

  const folder = gui.addFolder(title ?? 'THREE.PointsMaterial')
  folder.addColor(data, 'color').onChange(handleColorChange(material.color))
  folder.add(material, 'size', 0, 2, 0.01)
  folder.add(material, 'sizeAttenuation').onChange(needsUpdate(material, mesh))
  folder.add(material, 'vertexColors').onChange(needsUpdate(material, mesh))
}

export const initializeSpriteMaterial = (gui, mesh, material, title) => {
  const data = {
    color: material.color.getHex(),
    size: 1,
    sizeAttenuation: false
  }

  const folder = gui.addFolder(title ?? 'THREE.SpriteMaterial')
  folder.addColor(data, 'color').onChange(handleColorChange(material.color))
  folder.add(material, 'sizeAttenuation').onChange(needsUpdate(material, mesh))
}

function needsUpdate(material, mesh) {
  return function () {
    material.side = parseInt(material.side) //Ensure number
    material.needsUpdate = true

    visitChildren(mesh, (c) => {
      if (c.geometry) {
        c.geometry.attributes.position.needsUpdate = true
        if (c.geometry.attributes.normal) c.geometry.attributes.normal.needsUpdate = true
        if (c.geometry.attributes.color) c.geometry.attributes.color.needsUpdate = true
      }
    })
  }
}

function updateTexture(material, materialKey, textures) {
  return function (key) {
    material[materialKey] = textures[key]
    material.needsUpdate = true
  }
}

function updateCombine(material) {
  return function (combine) {
    material.combine = parseInt(combine)
    material.needsUpdate = true
  }
}

export { initializeGuiMaterial }
