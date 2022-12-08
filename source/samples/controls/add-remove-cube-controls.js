import * as SceneUtils from 'three/examples/jsm/utils/SceneUtils'
import * as THREE from 'three'
import { randomColor } from '../util/colorUtil.js'
import { randomVector } from '../util/positionUtil.js'

export const initializeAddRemoveCubeControls = (gui, parent, material) => {
  const addRemoveProps = {
    addCube: () => addCube(parent, material),
    removeCube: () => removeCube(parent)
  }

  gui.add(addRemoveProps, 'addCube')
  gui.add(addRemoveProps, 'removeCube')
}

const addCube = (parent, material) => {
  const color = randomColor()
  const pos = randomVector({
    xRange: { fromX: -4, toX: 4 },
    yRange: { fromY: -3, toY: 3 },
    zRange: { fromZ: -4, toZ: 4 }
  })

  const rotation = randomVector({
    xRange: { fromX: 0, toX: Math.PI * 2 },
    yRange: { fromY: 0, toY: Math.PI * 2 },
    zRange: { fromZ: 0, toZ: Math.PI * 2 }
  })

  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
  const cubeMaterial =
    material ??
    new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.1,
      metalness: 0.9
    })

  let cube

  if (Array.isArray(cubeMaterial)) {
    cube = SceneUtils.createMultiMaterialObject(geometry, cubeMaterial)
  } else {
    cube = new THREE.Mesh(geometry, cubeMaterial)
  }
  cube.name = 'cube-' + parent.children.length
  cube.position.copy(pos)
  cube.rotation.setFromVector3(rotation)
  cube.castShadow = true
  parent.add(cube)
}

const removeCube = (parent) => {
  parent.children.pop()
}
