import {
  axisHelper,
  axisHelperName,
  gridHelper,
  gridHelperName,
  polarGridHelper,
  polarGridHelperName,
} from "../helpers/helpers";

const propertiesObject = (scene) => ({
  axisHelper: {
    toggle: () => {
      const currentHelper = scene.getObjectByName(axisHelperName);
      if (currentHelper) {
        scene.remove(currentHelper);
      } else {
        axisHelper(scene);
      }
    },
  },
  gridHelper: {
    toggle: () => removeOrAddToScene(gridHelperName, scene, gridHelper),
  },
  polarGridHelper: {
    toggle: () =>
      removeOrAddToScene(polarGridHelperName, scene, polarGridHelper),
  },
});

export const initializeHelperControls = (gui, scene) => {
  const props = propertiesObject(scene);
  const helpers = gui.addFolder("Helpers");
  //   helpers.add('axisHelperEnabled', propertiesObject)
  helpers.add(props.axisHelper, "toggle").name("Toggle AxesHelper");
  helpers.add(props.gridHelper, "toggle").name("Toggle GridHelper");
  helpers.add(props.polarGridHelper, "toggle").name("Toggle PolarGridHelper");

  helpers.close();
};

const removeOrAddToScene = (name, scene, addFn) => {
  const currentObject = scene.getObjectByName(name);
  console.log(currentObject);
  if (currentObject) {
    scene.remove(currentObject);
  } else {
    addFn(scene);
  }
};
