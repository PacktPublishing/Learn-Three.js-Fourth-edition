// TODO: - reuse most of the stuff from chapter 1 setup, and from the previous version of the book.
//       - rewrite using the new setup.

// explore all the scene options availabe.
// add the scene control
import * as THREE from "three";
import { initScene } from "../../bootstrap/bootstrap.js";
import { floatingFloor, foreverPlane } from "../../bootstrap/floor.js";
import { intializeRendererControls } from "../../controls/renderer-control.js";
import { initializeHelperControls } from "../../controls/helpers-control.js";
import {
  initializeSceneControls,
  sceneControls,
} from "../../controls/scene-controls";
import GUI from "lil-gui";
import { stats } from "../../util/stats";
import { randomColor } from "../../util/colorUtil.js";
import { randomVector } from "../../util/positionUtil.js";
import { MeshStandardMaterial } from "three";
import { initializePerspectiveCameraControls } from "../../controls/camera-controls";

const props = {
  backgroundColor: 0xcccccc,
  fogColor: 0xffffff,
};
const gui = new GUI();

const addCube = (scene) => {
  const cubeGeom = new THREE.BoxGeometry(1, 1, 1);
  const cubeMat = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
  });
  const mesh = new THREE.Mesh(cubeGeom, cubeMat);
  mesh.castShadow = true;
  scene.add(mesh);
};

const externalCamera = () => {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // opposite of normally positioned camera
  camera.position.set(10, 2, -3);
  camera.lookAt(0, 0, 0);

  return camera;
};

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
  camera.position.set(-7, 2, 5);
  orbitControls.update();

  const helper = new THREE.CameraHelper(camera);
  scene.add(helper);

  initializePerspectiveCameraControls(camera, gui, orbitControls);

  floatingFloor(scene, 10);
  const newCamera = externalCamera();

  let renderWith = newCamera;

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, renderWith);
    stats.update();
    helper.update();
    orbitControls.update();
  }
  animate();

  intializeRendererControls(gui, renderer);
  initializeHelperControls(gui, scene);
  initializeSceneControls(gui, scene, true);

  gui.add(
    {
      switchCamera: () => {
        if (renderWith == newCamera) {
          renderWith = camera;
        } else {
          renderWith = newCamera;
        }
      },
    },
    "switchCamera"
  );

  addCube(scene);
});
