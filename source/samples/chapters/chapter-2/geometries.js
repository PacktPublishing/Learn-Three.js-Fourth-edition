// TODO: - reuse most of the stuff from chapter 1 setup, and from the previous version of the book.
//       - rewrite using the new setup.

// explore all the scene options availabe.
// add the scene control
import * as THREE from "three";
import { initScene } from "../../bootstrap/bootstrap.js";
import { floatingFloor, foreverPlane } from "../../bootstrap/floor.js";
import { intializeRendererControls } from "../../controls/renderer-control.js";
import { initializeHelperControls } from "../../controls/helpers-control.js";
import { initializeSceneControls } from "../../controls/scene-controls";
import GUI from "lil-gui";
import { stats } from "../../util/stats";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import { ParametricGeometries } from "three/examples/jsm/geometries/ParametricGeometries";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";
import { createMultiMaterialObject } from "three/examples/jsm/utils/SceneUtils";
import { randomColor } from "../../util/colorUtil.js";

const props = { backgroundColor: 0xffffff, disableShadows: true };
const gui = new GUI();

const addGeometries = (scene) => {
  const geoms = [];

  geoms.push(new THREE.CylinderGeometry(1, 4, 4));
  geoms.push(new THREE.BoxGeometry(2, 2, 2));
  geoms.push(new THREE.SphereGeometry(2));
  geoms.push(new THREE.IcosahedronGeometry(4));

  const points = [
    new THREE.Vector3(2, 2, 2),
    new THREE.Vector3(2, 2, -2),
    new THREE.Vector3(-2, 2, -2),
    new THREE.Vector3(-2, 2, 2),
    new THREE.Vector3(2, -2, 2),
    new THREE.Vector3(2, -2, -2),
    new THREE.Vector3(-2, -2, -2),
    new THREE.Vector3(-2, -2, 2),
  ];
  geoms.push(new ConvexGeometry(points));

  // create a lathgeometry
  const pts = [];
  const detail = 0.1;
  const radius = 3;
  for (
    var angle = 0.0;
    angle < Math.PI;
    angle += detail //loop from 0.0 radians to PI (0 - 180 degrees)
  )
    pts.push(
      new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
    ); //angle/radius to x,z
  geoms.push(new THREE.LatheGeometry(pts, 12));
  geoms.push(new THREE.OctahedronGeometry(3));
  geoms.push(new ParametricGeometry(ParametricGeometries.mobius3d, 20, 10));
  geoms.push(new THREE.TetrahedronGeometry(3));
  geoms.push(new THREE.TorusGeometry(3, 1, 10, 10));
  geoms.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20));

  var j = 0;
  for (var i = 0; i < geoms.length; i++) {
    var materials = [
      new THREE.MeshLambertMaterial({
        color: randomColor(),
      }),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
      }),
    ];

    var mesh = createMultiMaterialObject(geoms[i], materials);
    mesh.traverse(function (e) {
      e.castShadow = true;
    });

    mesh.position.x = -24 + (i % 4) * 12;
    mesh.position.y = 4;
    mesh.position.z = -8 + j * 12;

    if ((i + 1) % 4 == 0) j++;
    scene.add(mesh);
  }
};

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
  camera.position.set(-35, 10, 25);
  orbitControls.update();

  floatingFloor(scene, 60);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    stats.update();

    orbitControls.update();
  }
  animate();

  intializeRendererControls(gui, renderer);
  initializeHelperControls(gui, scene);
  initializeSceneControls(gui, scene);

  addGeometries(scene);
});
