import {Pheromone} from "./pheromone.js";

export {Track}

class Track {
    constructor(ant) {
        this.simulation = ant.simulation;
        this.pheromones = [];
        this.ID = ant.trackID;

        this.status = ant.notStatus;
        this.worth = ant.worth;
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
        if(!this.pheromones.length){
            if (this.complete) this.destroy();
            return;
        }

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
        for (let pheromone of this.pheromones) {
            pheromone.redraw(this.status);
        }
    }
}