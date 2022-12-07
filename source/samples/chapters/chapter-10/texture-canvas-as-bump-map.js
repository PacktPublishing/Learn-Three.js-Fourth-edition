import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeGuiMeshPhongMaterial } from '../../controls/material-controls'
import generator from 'perlin'

var canvas = document.createElement('canvas')
canvas.className = 'myClass'
canvas.style = 'position:absolute;'
canvas.setAttribute('width', 512)
canvas.setAttribute('height', 512)
document.body.append(canvas)

const ctx = canvas.getContext('2d')

for (var x = 0; x < 512; x++) {
  for (var y = 0; y < 512; y++) {
    var base = new THREE.Color(0xffffff)
    var value = (generator.noise.perlin2(x / 8, y / 8) + 1) / 2
    base.multiplyScalar(value)
    ctx.fillStyle = '#' + base.getHexString()
    ctx.fillRect(x, y, 1, 1)
  }
}
const material = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  bumpMap: new THREE.Texture(canvas)
})

material.bumpMap.needsUpdate = true

const props = {
  material: material,
  withMaterialGui: true,
  provideGui: (gui, mesh, material) => {
    initializeGuiMeshPhongMaterial(gui, mesh, material)

    gui.folders.map((f) => {
      if (f._title === 'Textures') {
        f.destroy()
      }
    })

    const wrappingTypes = {
      repeatWrapping: THREE.RepeatWrapping,
      clampToEdgeWrapping: THREE.ClampToEdgeWrapping,
      mirroredRepeatWrapping: THREE.MirroredRepeatWrapping
    }

    const props = {
      normalScaleX: 1,
      normalScaleY: 1,
      repeatX: 1,
      repeatY: 1,
      wrappingType: THREE.RepeatWrapping
    }
    const textureFolder = gui.addFolder('Textures')
    textureFolder.add(props, 'repeatX', 1, 10, 1).onChange(() => {
      material.bumpMap.repeat.set(props.repeatX, props.repeatY)
    })
    textureFolder.add(props, 'repeatY', 1, 10, 1).onChange(() => {
      material.bumpMap.repeat.set(props.repeatX, props.repeatY)
    })
    textureFolder.add(props, 'wrappingType', wrappingTypes).onChange(() => {
      material.bumpMap.wrapS = props.wrappingType
      material.bumpMap.wrapT = props.wrappingType
      material.bumpMap.needsUpdate = true
    })
  }
}

bootstrapMaterialScene(props).then()

// mention the other loaders in the text, and also explain RGBe and EXR. Don't show
// the loaders, but mention that we'll see them further down in the examples.
