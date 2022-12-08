import * as THREE from 'three'

const perspectiveName = 'Perspective Camera'
const orthoName = 'Orthographic Camera'

// TODO: check the lookat
const lookAtProps = () => ({
  lookAtX: 0,
  lookAtY: 0,
  lookAtZ: 0
})

export const initializePerspectiveCameraControls = (camera, gui, orbitControls, isOpen) => {
  const vectorProps = lookAtProps(camera)

  const props = {
    fov: camera.fov,
    aspect: camera.aspect,
    near: camera.near,
    far: camera.far,
    zoom: camera.zoom
  }

  removeIfPresent(gui, perspectiveName)
  removeIfPresent(gui, orthoName)

  const cameraFolder = gui.addFolder(perspectiveName)
  cameraFolder.add(props, 'fov', 0, 180, 1)
  cameraFolder.add(props, 'aspect', 0, 10, 0.1)
  cameraFolder.add(props, 'near', 0, 20, 0.1)
  cameraFolder.add(props, 'far', 5, 100, 0.1)
  cameraFolder.add(props, 'zoom', -1, 10, 0.1)

  cameraFolder.add(vectorProps, 'lookAtX', -10, 10, 0.1)
  cameraFolder.add(vectorProps, 'lookAtY', -10, 10, 0.1)
  cameraFolder.add(vectorProps, 'lookAtZ', -10, 10, 0.1)

  cameraFolder.onChange(() => {
    camera.fov = props.fov
    camera.aspect = props.aspect
    camera.near = props.near
    camera.far = props.far
    camera.zoom = props.zoom

    camera.updateProjectionMatrix()

    // since we're using a control, we also need to set that target
    orbitControls.target.set(vectorProps.lookAtX, vectorProps.lookAtY, vectorProps.lookAtZ)
    orbitControls.update()
  })

  isOpen ? cameraFolder.open() : cameraFolder.close()
}

export const initializeOrthographicCameraControls = (camera, gui, orbitControls) => {
  const vectorProps = lookAtProps(camera)

  const props = {
    left: camera.left,
    right: camera.right,
    top: camera.top,
    bottom: camera.bottom,
    near: camera.near,
    far: camera.far,
    zoom: camera.zoom
  }

  removeIfPresent(gui, perspectiveName)
  removeIfPresent(gui, orthoName)

  const cameraFolder = gui.addFolder(orthoName)
  cameraFolder.add(props, 'left', -400, -10, 1)
  cameraFolder.add(props, 'right', 10, 400, 1)
  cameraFolder.add(props, 'top', 0, 200, 1)
  cameraFolder.add(props, 'bottom', -200, 0, 1)
  cameraFolder.add(props, 'near', -20, 10, 1)
  cameraFolder.add(props, 'far', 1, 100, 1)
  cameraFolder.add(props, 'zoom', 1, 100, 1)
  cameraFolder.add(vectorProps, 'lookAtX', -10, 10, 0.1)
  cameraFolder.add(vectorProps, 'lookAtY', -10, 10, 0.1)
  cameraFolder.add(vectorProps, 'lookAtZ', -10, 10, 0.1)

  cameraFolder.onChange(() => {
    camera.left = props.left
    camera.right = props.right
    camera.top = props.top
    camera.bottom = props.bottom
    camera.near = props.near
    camera.far = props.far
    camera.zoom = props.zoom
    camera.updateProjectionMatrix()

    camera.lookAt(new THREE.Vector3(vectorProps.lookAtX, vectorProps.lookAtY, vectorProps.lookAtZ))

    // since we're using a control, we also need to set that target
    orbitControls.target.set(vectorProps.lookAtX, vectorProps.lookAtY, vectorProps.lookAtZ)

    orbitControls.update()
  })
}

const removeIfPresent = (gui, name) => {
  for (const folder of gui.foldersRecursive()) {
    if (folder._title === name) {
      folder.destroy()
    }
  }
}
