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
import { createMultiMaterialObject } from "three/examples/jsm/utils/SceneUtils";

const props = { backgroundColor: 0xffffff, fogColor: 0xffffff };
const gui = new GUI();

// The corner points (locations), which we're going to use to
// build up the geometry. These are the vertices.
// prettier-ignore
const v = [
    [1, 3, 1],
    [1, 3, -1],
    [1, -1, 1],
    [1, -1, -1],
    [-1, 3, -1],
    [-1, 3, 1],
    [-1, -1, -1],
    [-1, -1, 1]]

let bufferGeometry = undefined;

const updateCustomGeometry = (scene) => {
  // Buffergeometry requires an array of triples for each part of the face
  // prettier-ignore
  const faces = new Float32Array([
    ...v[0], ...v[2], ...v[1],
    ...v[2], ...v[3], ...v[1],
    ...v[4], ...v[6], ...v[5],
    ...v[6], ...v[7], ...v[5],
    ...v[4], ...v[5], ...v[1],
    ...v[5], ...v[0], ...v[1],
    ...v[7], ...v[6], ...v[2],
    ...v[6], ...v[3], ...v[2],
    ...v[5], ...v[7], ...v[0],
    ...v[7], ...v[2], ...v[0],
    ...v[1], ...v[3], ...v[4],
    ...v[3], ...v[6], ...v[4]
  ]);

  bufferGeometry = new THREE.BufferGeometry();
  bufferGeometry.setAttribute("position", new THREE.BufferAttribute(faces, 3));
  bufferGeometry.computeVertexNormals();

  const mesh = meshFromGeometry(bufferGeometry);
  mesh.name = "customGeometry";
  // remove the old one
  const p = scene.getObjectByName("customGeometry");
  if (p) scene.remove(p);

  // add the new one
  scene.add(mesh);
  return { mesh: mesh, geometry: bufferGeometry };
};

const cloneGeometry = (scene) => {
  if (bufferGeometry) {
    const clonedGeometry = bufferGeometry.clone();
    const backingArray = clonedGeometry.getAttribute("position").array;
    for (const i in backingArray) {
      if ((i + 1) % 3 === 0) {
        backingArray[i] = backingArray[i] + 3;
      }
    }
    clonedGeometry.getAttribute("position").needsUpdate = true;
    const cloned = meshFromGeometry(clonedGeometry);
    cloned.name = "clonedGeometry";
    const p = scene.getObjectByName("clonedGeometry");
    if (p) scene.remove(p);
    scene.add(cloned);
  }
};

const meshFromGeometry = (geometry) => {
  var materials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }),
    new THREE.MeshLambertMaterial({
      opacity: 0.1,
      color: 0xff0044,
      transparent: true,
    }),
  ];

  var mesh = createMultiMaterialObject(geometry, materials);
  mesh.name = "customGeometry";
  mesh.children.forEach(function (e) {
    e.castShadow = true;
  });

  return mesh;
};

const addVerticesControl = (scene) => {
  const verticesFolder = gui.addFolder("vertices");
  verticesFolder.add({ clone: () => cloneGeometry(scene) }, "clone");

  for (const [i, vector] in v) {
    const props = {
      x: v[i][0],
      y: v[i][1],
      z: v[i][2],
    };

    const subFolder = verticesFolder.addFolder("Vertex " + i);
    subFolder.add(props, "x", -10, 10, 0.1).onChange((value) => {
      v[i][0] = value;
    });
    subFolder.add(props, "y", -10, 10, 0.1).onChange((value) => {
      v[i][1] = value;
    });
    subFolder.add(props, "z", -10, 10, 0.1).onChange((value) => {
      v[i][2] = value;
    });
  }
};

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
  camera.position.set(-7, 2, 5);
  orbitControls.update();

  floatingFloor(scene, 10);

  function animate() {
    // lazy way, we just readd the complete object.
    // TODO: Determine a better way
    updateCustomGeometry(scene);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    stats.update();
    orbitControls.update();
  }
  animate();

  intializeRendererControls(gui, renderer);
  initializeHelperControls(gui, scene);
  initializeSceneControls(gui, scene);

  addVerticesControl(scene);
});
