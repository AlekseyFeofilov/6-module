import {redColor, blackColor, enumExportNumber, greyColor} from "./extension/enum.js";

const properties = {
    backgroundColor: blackColor,
    backgroundBorderColor: greyColor,
    antColor: redColor,

    bodySize: 300,
    antSize: 1,
    pheromoneSize: 2,
    gridSize: 500,

    foodSize: 10,
    anthillSize: 10,

    antCount: 100,
    pheromoneCount: 100,

    antSpeed: 1,
    pheromoneFrequency: 1,

    antConfidence: 0.1,
    antConservatism: Math.PI / 4,

    pheromoneLifeCycleStep: 5,
    pheromoneLifeCycle: 50,
    pheromoneLifeCycleCoefficient: 60,

    pheromoneStrength: 40,
    pheromoneOpacity: 100,
}

export {properties};