import { bootstrapMeshScene } from './util/standard-scene'
import { PDBLoader } from 'three/examples/jsm/loaders/PDBLoader'
import * as THREE from 'three'

const modelAsync = () => {
  return new PDBLoader().loadAsync('/assets/models/molecules/diamond.pdb').then((geometries) => {
    var group = new THREE.Object3D()

    // create the atoms
    const geometryAtoms = geometries.geometryAtoms
    console.log(geometryAtoms)
    for (let i = 0; i < geometryAtoms.attributes.position.count; i++) {
      let startPosition = new THREE.Vector3()
      startPosition.x = geometryAtoms.attributes.position.getX(i)
      startPosition.y = geometryAtoms.attributes.position.getY(i)
      startPosition.z = geometryAtoms.attributes.position.getZ(i)

      let color = new THREE.Color()
      color.r = geometryAtoms.attributes.color.getX(i)
      color.g = geometryAtoms.attributes.color.getY(i)
      color.b = geometryAtoms.attributes.color.getZ(i)

      let material = new THREE.MeshPhongMaterial({
        color: color
      })

      let sphere = new THREE.SphereGeometry(0.2)
      let mesh = new THREE.Mesh(sphere, material)
      mesh.position.copy(startPosition)
      group.add(mesh)
    }

    // create the bindings
    const geometryBonds = geometries.geometryBonds

    for (let j = 0; j < geometryBonds.attributes.position.count; j += 2) {
      let startPosition = new THREE.Vector3()
      startPosition.x = geometryBonds.attributes.position.getX(j)
      startPosition.y = geometryBonds.attributes.position.getY(j)
      startPosition.z = geometryBonds.attributes.position.getZ(j)

      let endPosition = new THREE.Vector3()
      endPosition.x = geometryBonds.attributes.position.getX(j + 1)
      endPosition.y = geometryBonds.attributes.position.getY(j + 1)
      endPosition.z = geometryBonds.attributes.position.getZ(j + 1)

      // use the start and end to create a curve, and use the curve to draw
      // a tube, which connects the atoms
      let path = new THREE.CatmullRomCurve3([startPosition, endPosition])
      let tube = new THREE.TubeGeometry(path, 1, 0.04)
      let material = new THREE.MeshPhongMaterial({
        color: 0xcccccc
      })
      let mesh = new THREE.Mesh(tube, material)
      group.add(mesh)
    }

    group.scale.set(0.5, 0.5, 0.5)
    return group
  })
}

bootstrapMeshScene({
  loadMesh: modelAsync,
  hidefloor: true
}).then()
