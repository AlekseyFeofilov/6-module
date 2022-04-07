import {random} from "../extension/random.js";
import {ANTHILL, FOOD, POSITION_X, POSITION_Y, RADIUS} from "../strings.js";
import {properties} from "../properties.js";
import {isGrey} from "../extension/color.js";
import {Track} from "./track.js";

export {Ants}

class Ants {
    constructor(simulation) {
        this.simulation = simulation;

        this.direction = random(0, Math.PI * 2);
        this.positionX = this.simulation.anthill[POSITION_X] + Math.cos(this.direction) * this.simulation.anthill[RADIUS];
        this.positionY = this.simulation.anthill[POSITION_Y] + Math.sin(this.direction) * this.simulation.anthill[RADIUS];

        this.status = FOOD;
        this.notStatus = ANTHILL;
        this.pheromoneNumber = properties.pheromoneTrackLength;
        this.worth = 5;

        this.setTrack();
    }

    getPositionX(angle) {
        return this.positionX + Math.cos(angle) * properties.antSpeed;
    }

    getPositionY(angle) {
        return this.positionY + Math.sin(angle) * properties.antSpeed;
    }

    getColor(positionX, positionY) {
        return this.simulation.context.getImageData(positionX, positionY, 1, 1).data
    }

    isItNear(positionX, positionY, object) {
        return Math.abs(positionX - object[POSITION_X]) < object[RADIUS] &&
            Math.abs(positionY - object[POSITION_Y]) < object[RADIUS]
    }

    changeStatus(worth) {
        [this.status, this.notStatus] = [this.notStatus, this.status];
        this.pheromoneNumber = properties.pheromoneTrackLength;
        this.direction += Math.PI;
        this.worth = worth;

        this.simulation.tracks.get(this.trackID).finish();
        this.setTrack();
    }

    setTrack() {
        this.trackID = Symbol();
        this.simulation.tracks.set(this.trackID, new Track(this.notStatus, this.worth, this.trackID, this.simulation));
    }

    moveToRandomDirection() {
        this.direction += random(-properties.antConservatism, properties.antConservatism);

        //todo: experiment with get stacking
        //let i = 0;
        while (isGrey(this.getColor(
            this.getPositionX(this.direction),
            this.getPositionY(this.direction)
        ))) {
            /*if(i++ > 8){
                this.constructor();
            }*/

            this.direction = random(0, Math.PI * 2);
        }

        this.positionX = this.getPositionX(this.direction);
        this.positionY = this.getPositionY(this.direction);
    }

    calculateProbability(pheromones) {
        let localPheromoneStrengths = [];
        let totalPheromoneStrength = 0;

        pheromones.forEach((pheromoneIndex, trackID) => {
            let track = this.simulation.tracks.get(trackID);

            if (track.status === this.status) {
                let pheromone = track.pheromones[pheromoneIndex];

                if(Math.abs(pheromone.direction % (Math.PI * 2) - this.direction % (Math.PI * 2)) < Math.PI / 2 ||
                    Math.abs(pheromone.direction % (Math.PI * 2) - this.direction % (Math.PI * 2)) > (Math.PI * 2) - Math.PI / 2) {


                    let distance = pheromone.distance;
                    let antNumber = track.previousAntNumber;
                    let worth = track.worth;
                    track.pushAnt();

                    let probability = properties.antPatience / distance ** 2 +
                        (antNumber + 1) ** properties.antConformism *
                        worth ** properties.antGreed;

                    localPheromoneStrengths.push(
                        {'trackID': trackID, 'pheromoneIndex': pheromoneIndex, 'probability': probability}
                    );

                    totalPheromoneStrength += probability;
                }
            }
        });

        for (let strength of localPheromoneStrengths){
            strength['probability'] /= totalPheromoneStrength;
        }

        return localPheromoneStrengths;
    }

    setRandomDecision(probabilities) {
        let randomNumber = random(0, 1);
        let probability = 0;
        let next = 0;

        while (probability < randomNumber || next < probabilities.length) {
            probability += probabilities[next++]['probability'];
        }

        let trackID = probabilities[--next]['trackID'];
        let pheromoneIndex = probabilities[next]['pheromoneIndex'];

        this.direction = this.simulation.tracks.get(trackID).pheromones[pheromoneIndex].direction;

        if(!isGrey(this.getColor(
            this.getPositionX(this.direction),
            this.getPositionY(this.direction)
        ))) {
            this.positionX = this.getPositionX(this.direction);
            this.positionY = this.getPositionY(this.direction);
        }
        else{
            this.moveToRandomDirection();
        }
    }

    spreadPheromone() {
        let currentPosition = this.simulation.getFieldInformation(this.positionX, this.positionY)
        currentPosition.set(this.trackID, this.simulation.tracks.get(this.trackID).pheromones.length - 1)
    }

    makePheromone() {
        if (this.pheromoneNumber < 0) return;

        this.pheromoneNumber--;

        if (this.simulation.getFieldInformation(this.positionX, this.positionY).size > 25 ||
            this.simulation.getFieldInformation(this.positionX, this.positionY).has(this.trackID)) {
            return;
        }

        if (this.pheromoneNumber % properties.pheromoneFrequency !== 0) return;

        this.simulation.tracks.get(this.trackID).addPheromone(this);

        this.spreadPheromone();
    }

    move() {
        this.simulation.food.forEach(food => {
            if (this.isItNear(this.positionX, this.positionY, food) && this.status === FOOD) {
                this.changeStatus(food['worth']);
            }
        });

        if (this.isItNear(this.positionX, this.positionY, this.simulation.anthill) && this.status === ANTHILL) {
            this.changeStatus(this.simulation.anthill['worth']);
        }

        let currentPheromones = this.simulation.getFieldInformation(this.positionX, this.positionY);

        if (!currentPheromones.size || 0.3 / currentPheromones.size > random(0, 1)) {
            this.moveToRandomDirection();
        } else {
            let probabilities = this.calculateProbability(currentPheromones);

            if (!probabilities.length) {
                this.moveToRandomDirection();
            } else {
                this.setRandomDecision(probabilities);
            }
        }

        this.makePheromone();
    }

    redraw() {
        this.simulation.drawCircle(
            this.positionX,
            this.positionY,
            properties.antSize,
            properties.antColor);
    }
}