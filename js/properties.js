import {redColor, blackColor, enumExportNumber, greyColor} from "./extension/enum.js";

const properties = {
    backgroundColor: blackColor,
    backgroundBorderColor: greyColor,
    antColor: redColor,

    bodySize: 300,
    antSize: 1,
    pheromoneSize: 2,
    gridSize: 300,

    foodSize: 10,
    anthillSize: 10,

    antCount: 100,
    pheromoneCount: 100,

    antGreed: 1,
    antConformism: 2,

    antSpeed: 2,
    pheromoneFrequency: 1,

    antConfidence: 0.1,
    antConservatism: Math.PI / 12,

    pheromoneLifeCycleStep: 5,
    pheromoneLifeCycle: 100,
    pheromoneLifeCycleCoefficient: 60,

    pheromoneStrength: 40,
    pheromoneOpacity: 100,
}

export {properties};