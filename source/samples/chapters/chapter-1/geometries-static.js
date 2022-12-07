import * as THREE from "three";
import { initScene } from "../../bootstrap/bootstrap.js";
import { foreverPlane } from "../../bootstrap/floor.js";

const props = {
  backgroundColor: 0xffffff,
  fogColor: 0xffffff,
};

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
  
  const geometry = new THREE.BoxGeometry();
  const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xFF00FF });
  const cube = new THREE.Mesh(geometry, cubeMaterial);
  
  cube.position.x = -1;
  cube.castShadow = true;
  scene.add(cube);

  const torusKnotGeom = new THREE.TorusKnotBufferGeometry(0.5, 0.2, 100, 100);
  const torusKnotMat = new THREE.MeshStandardMaterial({
    color: 0x00ff88,
    roughness: 0.1,
  });
  const torusKnotMesh = new THREE.Mesh(torusKnotGeom, torusKnotMat);
  torusKnotMesh.castShadow = true;
  torusKnotMesh.position.x = 2;
  scene.add(torusKnotMesh);

  camera.position.x = -3;
  camera.position.z = 3;
  camera.position.y = 2;
  orbitControls.update();

  foreverPlane(scene);
  renderer.render(scene, camera);
});
