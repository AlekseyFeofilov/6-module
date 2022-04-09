import {properties} from "../extension/properties.js";
import {FOOD} from "../extension/strings.js";
import {circleDrawing} from "../extension/drawing.js";

export {Pheromone}

class Pheromone {
    constructor(ant, simulation) {
        this.simulation = simulation;
        this.context = simulation.pheromoneContext;
        this.positionX = ant.positionX;
        this.positionY = ant.positionY;
        this.direction = ant.direction + Math.PI;

        this.distance = properties.pheromoneTrackLength - ant.pheromoneNumber;
        this.lifeCycle = (properties.pheromoneTrackLength - this.distance) * 20;
    }

    lifeDecrease() {
        this.lifeCycle -= properties.pheromoneLifeCycleStep;
    }

    redraw(status) {
        if(properties.drawPheromone) {
            let transparent = this.lifeCycle / (this.distance + properties.pheromoneTrackLength) / 40;

            circleDrawing(
                this.positionX,
                this.positionY,
                properties.pheromoneSize,
                status === FOOD ?
                    `rgba(40, 255, 40, ${transparent})`
                    : `rgba(255, 40, 40, ${transparent})`,
                this.context
            );
        }
    }
}