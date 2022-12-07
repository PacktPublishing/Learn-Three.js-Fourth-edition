import * as THREE from 'three'
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

export const addBloomPassControls = (gui, controls, callback) => {
  controls.strength = 3
  controls.kernelSize = 25
  controls.sigma = 5.0
  controls.resolution = 256

  controls.updateBloomPass = () => {
    const bloomPass = new BloomPass(controls.strength, controls.kernelSize, controls.sigma, controls.resolution)
    callback(bloomPass)
  }

  const bloomFolder = gui.addFolder('BloomPass')
  bloomFolder.add(controls, 'strength', 0, 5, 0.01).onChange(controls.updateBloomPass)
  bloomFolder.add(controls, 'kernelSize', 10, 100, 1).onChange(controls.updateBloomPass)
  bloomFolder.add(controls, 'sigma', 1, 8, 0.1).onChange(controls.updateBloomPass)
  bloomFolder.add(controls, 'resolution', 100, 256, 10).onChange(controls.updateBloomPass)
}

export const addGlitchPassControls = (gui, controls, callback) => {
  controls.dtsize = 64
  const gpFolder = gui.addFolder('GlitchPass')
  gpFolder.add(controls, 'dtsize', 0, 1024).onChange(function (e) {
    callback(new GlitchPass(e))
  })
}

export const addHalftonePassControls = (gui, controls, callback) => {
  controls.shape = 1
  controls.radius = 4
  controls.rotateR = (Math.PI / 12) * 1
  controls.rotateG = (Math.PI / 12) * 2
  controls.rotateB = (Math.PI / 12) * 2
  controls.scatter = 0
  controls.blending = 0.4
  controls.blendingMode = 1
  controls.greyscale = false

  const applyParams = () => {
    const newPass = new HalftonePass(controls.width, controls.height, controls)
    callback(newPass)
  }

  const htFolder = gui.addFolder('HalfTonePass')
  htFolder.add(controls, 'shape', { dot: 1, ellipse: 2, line: 3, square: 4 }).onChange(applyParams)
  htFolder.add(controls, 'radius', 0, 40, 0.1).onChange(applyParams)
  htFolder.add(controls, 'rotateR', 0, Math.PI * 2, 0.1).onChange(applyParams)
  htFolder.add(controls, 'rotateG', 0, Math.PI * 2, 0.1).onChange(applyParams)
  htFolder.add(controls, 'rotateB', 0, Math.PI * 2, 0.1).onChange(applyParams)
  htFolder.add(controls, 'scatter', 0, 2, 0.1).onChange(applyParams)
  htFolder.add(controls, 'blending', 0, 2, 0.01).onChange(applyParams)
  htFolder
    .add(controls, 'blendingMode', { linear: 1, multiply: 2, add: 3, lighter: 4, darker: 5 })
    .onChange(applyParams)
  htFolder.add(controls, 'greyscale').onChange(applyParams)
}

export const addOutlinePassControls = (gui, controls, outlinePass) => {
  controls.edgeStrength = 3.0
  controls.edgeGlow = 0.0
  controls.edgeThickness = 1.0
  controls.pulsePeriod = 0
  controls.usePatternTexture = false

  var folder = gui.addFolder('OutlinePass')
  folder.add(controls, 'edgeStrength', 0.01, 10).onChange(function (value) {
    outlinePass.edgeStrength = Number(value)
  })
  folder.add(controls, 'edgeGlow', 0.0, 1).onChange(function (value) {
    outlinePass.edgeGlow = Number(value)
  })
  folder.add(controls, 'edgeThickness', 1, 4).onChange(function (value) {
    outlinePass.edgeThickness = Number(value)
  })
  folder.add(controls, 'pulsePeriod', 0.0, 5).onChange(function (value) {
    outlinePass.pulsePeriod = Number(value)
  })

  var colors = {
    visibleEdgeColor: '#ffffff',
    hiddenEdgeColor: '#190a05'
  }

  folder.addColor(colors, 'visibleEdgeColor').onChange(function (value) {
    outlinePass.visibleEdgeColor.set(value)
  })
  folder.addColor(colors, 'hiddenEdgeColor').onChange(function (value) {
    outlinePass.hiddenEdgeColor.set(value)
  })
}

export const addUnrealBloomPassControls = (gui, controls, callback) => {
  controls.resolution = 256
  controls.strength = 0.5
  controls.radius = 0.1
  controls.threshold = 0.1

  function newBloom() {
    var newPass = new UnrealBloomPass(
      new THREE.Vector2(controls.resolution, controls.resolution),
      controls.strength,
      controls.radius,
      controls.threshold
    )
    callback(newPass)
  }

  var folder = gui.addFolder('UnrealBloom')
  folder.add(controls, 'resolution', 2, 1024, 2).onChange(newBloom)
  folder.add(controls, 'strength', 0, 1, 0.01).onChange(newBloom)
  folder.add(controls, 'radius', 0, 10, 0.01).onChange(newBloom)
  folder.add(controls, 'threshold', 0, 0.2, 0.01).onChange(newBloom)
}

export const addShaderControl = (gui, folderName, shaderPass, toSet, enabled) => {
  function uniformOrDefault(uniforms, key, def) {
    return uniforms[key].value !== undefined && uniforms[key].value !== null ? uniforms[key].value : def
  }

  function addUniformBool(folder, key, shader) {
    var localControls = {}
    localControls[key] = uniformOrDefault(shader.uniforms, key, 0)
    folder.add(localControls, key).onChange(function (v) {
      shader.uniforms[key].value = v
    })
  }

  function addUniformFloat(folder, key, from, to, step, shader) {
    var localControls = {}
    localControls[key] = uniformOrDefault(shader.uniforms, key, 0)
    folder.add(localControls, key, from, to, step).onChange(function (v) {
      shader.uniforms[key].value = v
    })
  }

  function addUniformColor(folder, key, shader) {
    var localControls = {}
    localControls[key] = uniformOrDefault(shader.uniforms, key, new THREE.Color(0xffffff))
    folder.addColor(localControls, key).onChange(function (value) {
      shader.uniforms[key].value = new THREE.Color().setRGB(value.r, value.g, value.b)
    })
  }

  function addUniformVector3(folder, key, shader, from, to, step) {
    var startValue = uniformOrDefault(shader.uniforms, key, new THREE.Vector3(0, 0, 0))
    var keyX = key + '_x'
    var keyY = key + '_y'
    var keyZ = key + '_z'

    var localControls = {}
    localControls[keyX] = startValue.x
    localControls[keyY] = startValue.y
    localControls[keyZ] = startValue.z

    folder.add(localControls, keyX, from.x, to.x, step.x).onChange(function (v) {
      shader.uniforms[key].value.x = v
    })
    folder.add(localControls, keyY, from.x, to.x, step.x).onChange(function (v) {
      shader.uniforms[key].value.y = v
    })
    folder.add(localControls, keyZ, from.x, to.x, step.x).onChange(function (v) {
      shader.uniforms[key].value.z = v
    })
  }

  function addUniformVector2(folder, key, shader, from, to, step) {
    var startValue = uniformOrDefault(shader.uniforms, key, new THREE.Vector2(0.0, 0.0))
    shader.uniforms[key].value = startValue

    var keyX = key + '_x'
    var keyY = key + '_y'

    var localControls = {}
    localControls[keyX] = startValue.x
    localControls[keyY] = startValue.y

    folder.add(localControls, keyX, from.x, to.x, step.x).onChange(function (v) {
      shader.uniforms[key].value.x = v
    })
    folder.add(localControls, keyY, from.x, to.x, step.x).onChange(function (v) {
      shader.uniforms[key].value.y = v
    })
  }

  // create the folder and set enabled
  var folder = gui.addFolder(folderName)
  if (toSet.setEnabled !== undefined ? toSet.setEnabled : true) {
    shaderPass.enabled = enabled !== undefined ? enabled : false
    folder.add(shaderPass, 'enabled')
  }

  if (toSet.floats !== undefined) {
    toSet.floats.forEach(function (p) {
      var from = p.from !== undefined ? p.from : 0
      var to = p.from !== undefined ? p.to : 1
      var step = p.from !== undefined ? p.step : 0.01
      addUniformFloat(folder, p.key, from, to, step, shaderPass)
    })
  }

  if (toSet.colors !== undefined) {
    toSet.colors.forEach(function (p) {
      console.log('Sfdsd')
      addUniformColor(folder, p.key, shaderPass)
    })
  }

  if (toSet.vector3 !== undefined) {
    toSet.vector3.forEach(function (p) {
      addUniformVector3(folder, p.key, shaderPass, p.from, p.to, p.step)
    })
  }

  if (toSet.vector2 !== undefined) {
    toSet.vector2.forEach(function (p) {
      addUniformVector2(folder, p.key, shaderPass, p.from, p.to, p.step)
    })
  }

  if (toSet.booleans !== undefined) {
    toSet.booleans.forEach(function (p) {
      addUniformBool(folder, p.key, shaderPass)
    })
  }
}
