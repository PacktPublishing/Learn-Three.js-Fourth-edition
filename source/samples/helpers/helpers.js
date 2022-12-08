import * as THREE from 'three'

export const axisHelperName = 'axesHelper'
export const gridHelperName = 'gridHelper'
export const polarGridHelperName = 'polarGridHelper'

export const axisHelper = (scene) => {
  const axesHelper = new THREE.AxesHelper(5)
  axesHelper.name = axisHelperName
  scene.add(axesHelper)
}

export const gridHelper = (scene) => {
  const size = 10
  const divisions = 10
  const gridHelper = new THREE.GridHelper(size, divisions)
  gridHelper.name = gridHelperName
  scene.add(gridHelper)
}

export const polarGridHelper = (scene) => {
  const radius = 10
  const radials = 16
  const circles = 8
  const divisions = 64
  const polarGridHelper = new THREE.PolarGridHelper(radius, radials, circles, divisions)
  polarGridHelper.name = polarGridHelperName
  scene.add(polarGridHelper)
}
