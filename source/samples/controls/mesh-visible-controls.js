export const initializeMeshVisibleControls = (gui, mesh, title) => {
  const folder = gui.addFolder(title)
  folder.add(mesh, 'visible')
}
