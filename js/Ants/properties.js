import {redColor, blackColor, enumExportNumber, greyColor} from "./extension/enum.js";

const properties = {
    backgroundColor: blackColor,
    backgroundBorderColor: greyColor,
    antColor: redColor,

    //sizes
    bodySize: 300,
    antSize: 1,
    pheromoneSize: 2,
    anthillSize: 10,
    gridSize: 100,
    foodSize: 10,

    //todo: replace count to number
    antCount: 100,
    pheromoneCount: 100,
    pathNumber: 100,

    antGreed: 1,
    antConformism: 3,
    antPatience: 100000,

    antSpeed: 3,
    pheromoneFrequency: 3,

    antConfidence: 0.1,
    antConservatism: Math.PI / 12,

    //todo: play with step and coef.
    pheromoneLifeCycle: 100,
    pheromoneLifeCycleStep: 10,
    pheromoneLifeCycleCoefficient: 20,

    pheromoneStrength: 40,
    pheromoneTrackLength: 200,
}

export {properties};