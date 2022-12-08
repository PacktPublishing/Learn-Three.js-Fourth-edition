import * as THREE from "three";

export const randomVector = ({
  xRange: { fromX, toX },
  yRange: { fromY, toY },
  zRange: { fromZ, toZ },
}) => {
  const x = Math.random() * (toX - fromX) + fromX;
  const y = Math.random() * (toY - fromY) + fromY;
  const z = Math.random() * (toZ - fromZ) + fromZ;

  return new THREE.Vector3(x, y, z);
};
