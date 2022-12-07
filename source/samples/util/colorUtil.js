import * as THREE from 'three'

export const randomColor = () => {
  var r = Math.random(),
    g = Math.random(),
    b = Math.random()
  return new THREE.Color(r, g, b)
}
