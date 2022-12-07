import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeGuiMeshPhongMaterial } from '../../controls/material-controls'
import Mandelbrot from 'mandelbrot-canvas'

const div = document.createElement('div')
div.id = 'mandelbrot'
div.style = 'position: absolute'
document.body.append(div)

const mandelbrot = new Mandelbrot(document.getElementById('mandelbrot'), {
  height: 300,
  width: 300,
  magnification: 100
})
mandelbrot.render()

const material = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  map: new THREE.Texture(document.querySelector('#mandelbrot canvas'))
})

material.map.needsUpdate = true

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
      material.map.repeat.set(props.repeatX, props.repeatY)
    })
    textureFolder.add(props, 'repeatY', 1, 10, 1).onChange(() => {
      material.map.repeat.set(props.repeatX, props.repeatY)
    })
    textureFolder.add(props, 'wrappingType', wrappingTypes).onChange(() => {
      material.map.wrapS = props.wrappingType
      material.map.wrapT = props.wrappingType
      material.map.needsUpdate = true
    })
  }
}

bootstrapMaterialScene(props).then()

// mention the other loaders in the text, and also explain RGBe and EXR. Don't show
// the loaders, but mention that we'll see them further down in the examples.
