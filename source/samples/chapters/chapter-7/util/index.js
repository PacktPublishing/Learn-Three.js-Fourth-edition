export const updateMesh = (mesh, geometry) => {
  mesh.geometry.dispose()
  mesh.geometry = geometry
}
