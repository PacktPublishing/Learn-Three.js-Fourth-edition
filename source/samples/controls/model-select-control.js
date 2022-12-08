import GUI from "lil-gui";
import * as THREE from "three";
import { getObjectsKeys } from "../util/index.js";

// expects a
export const initializeModelSelectControls = (gui, models, onSelected) => {
  const modelControlFolder = gui.addFolder("Models");
  const modelNames = getObjectsKeys(models);

  const data = {
    model: modelNames[0],
  };

  modelControlFolder
    .add(data, "model", modelNames)
    .onChange((s) => onSelected(models[s]));
};
