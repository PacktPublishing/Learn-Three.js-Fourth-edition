import * as THREE from "three";
import { initScene } from "../../bootstrap/bootstrap.js";
import { foreverPlane } from "../../bootstrap/floor.js";
import { intializeRendererControls } from "../../controls/renderer-control.js";
import { initializeHelperControls } from "../../controls/helpers-control.js";
import GUI from "lil-gui";
import { stats } from "../../util/stats"

const props = {
  backgroundColor: 0xffffff,
  fogColor: 0xffffff,
};

const gui = new GUI();

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
  
  const geometry = new THREE.BoxGeometry();
  const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x0000FF });
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
  camera.position.z = 8;
  camera.position.y = 2;
  orbitControls.update();

  foreverPlane(scene);

  let step = 0;
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    stats.update();
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;

    torusKnotMesh.rotation.x -= 0.01;
    torusKnotMesh.rotation.y += 0.01;
    torusKnotMesh.rotation.z -= 0.01;
    
    // uncomment this to have the cube jump around
    step += 0.04;
    cube.position.x = 4*(Math.cos(step)); 
    cube.position.y = 4*Math.abs(Math.sin(step));

    orbitControls.update();
  }
  animate();

  intializeRendererControls(gui, renderer);
  initializeHelperControls(gui, scene);
});
