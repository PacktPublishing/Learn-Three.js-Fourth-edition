import * as THREE from 'three'
import { bootstrapMaterialScene } from './util/standard-scene'
import { initializeGuiMeshStandardMaterial } from '../../controls/material-controls'

const videoString = `
<video
  id="video"
  src="/assets/movies/Big_Buck_Bunny_small.ogv"
  controls="true"
</video>
`

const div = document.createElement('div')
div.style = 'position: absolute'
document.body.append(div)
div.innerHTML = videoString

const video = document.getElementById('video')
const texture = new THREE.VideoTexture(video)

const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  map: texture
})

const props = {
  material: material,
  withMaterialGui: true,
  provideGui: (gui, mesh, material) => {
    initializeGuiMeshStandardMaterial(gui, mesh, material)
  }
}

bootstrapMaterialScene(props).then()

// mention the other loaders in the text, and also explain RGBe and EXR. Don't show
// the loaders, but mention that we'll see them further down in the examples.
