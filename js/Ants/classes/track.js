import {Pheromone} from "./pheromone.js";

export {Track}

class Track {
    constructor(status, worth, ID, simulation) {
        this.simulation = simulation;
        this.pheromones = [];
        this.ID = ID;

        this.status = status;
        this.worth = worth;
        this.complete = false;

        this.previousAntNumber = 0;
        this.curretnAntNumber = 0;
    }

    destroy() {
        this.simulation.tracks.delete(this.ID);
    }

    addPheromone(ant) {
        this.pheromones.push(new Pheromone(ant, this.simulation));
    }

    finish() {
        this.complete = true;
    }

    update() {
        if(!this.pheromones.length) return;

        while (this.pheromones.last().lifeCycle < 0) {
            let pheromone = this.pheromones.last();
            this.simulation.getFieldInformation(pheromone.positionX, pheromone.positionY).delete(this.ID);
            this.pheromones.pop();

            if (!this.pheromones.length) {
                if (this.complete){
                    this.destroy();
                }

                return;
            }
        }
    }

    pushAnt() {
        this.curretnAntNumber++;
    }

    clearTrack() {
        this.previousAntNumber = this.curretnAntNumber;
        this.curretnAntNumber = 0;
    }

    redraw() {
        this.update();

        for (let pheromone of this.pheromones) {
            pheromone.redraw(this.status);
        }
    }
}