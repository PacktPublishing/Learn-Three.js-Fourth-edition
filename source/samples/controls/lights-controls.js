import * as THREE from "three";

export const initializeAmbientLightControls = (gui, light) => {
  const colorHolder = new THREE.Color(light.color);

  const ambientLightProps = {
    color: colorHolder.getStyle(),
    intensity: light.intensity,
  };

  const ambienLightFolder = gui.addFolder("Ambient Light");
  ambienLightFolder
    .add(ambientLightProps, "intensity", 0, 5, 0.1)
    .onChange((i) => (light.intensity = i));
  ambienLightFolder.addColor(ambientLightProps, "color").onChange((c) => {
    light.color.setStyle(c);
  });
};
