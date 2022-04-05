import {random, RandomPosition} from "./extension/random.js";
import {isRed, isGreen, isGrey} from "./extension/color.js";
import {properties} from "./properties.js";
import {redColor, greenColor} from "./extension/enum.js";
import {ANTHILL, FOOD, POSITION_X, POSITION_Y, CLICK, RADIUS, BORDER_WIDTH, ANGLE} from "./constants.js";

class Track {
    constructor(status, worth, ID) {
        this.pheromones = [];
        this.ID = ID;

        this.status = status;
        this.worth = worth;
        this.complete = false;

        this.previousAntNumber = 0;
        this.curretnAntNumber = 0;
    }

    destroy() {
        antSimulation.tracks.delete(this.ID);
    }

    addPheromone(ant) {
        this.pheromones.push(new Pheromone(ant));
    }

    finish() {
        this.complete = true;
    }

    update() {
        if(!this.pheromones.length) return;

        while (this.pheromones.last().lifeCycle < 0) {
            let pheromone = this.pheromones.last();
            antSimulation.getFieldInformation(pheromone.positionX, pheromone.positionY).delete(this.ID);
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

class Pheromone {
    constructor(ant) {
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
        this.lifeDecrease();
        let transparent = this.lifeCycle / (this.distance + properties.pheromoneTrackLength) / 40;
        //let transparent = 0;

        antSimulation.drawCircle(
            this.positionX,
            this.positionY,
            properties.pheromoneSize,
            status === FOOD ?
                `rgba(40, 255, 40, ${transparent})`
                : `rgba(255, 40, 40, ${transparent})`
        );
    }
}

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
        this.simulation.tracks.set(this.trackID, new Track(this.notStatus, this.worth, this.trackID));
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

class AntsSimulation {
    constructor() {
        this.objectsInit();
        this.canvasInit();

        //todo: изменить на пользовательский сеттер
        this.objectsSet();
    }

    objectsInit(){
        this.anthill = {};
        this.tracks = new Map;

        this.food = [];
        this.ants = [];
        this.field = [];
    }

    objectsSet(){
        this.setAnthill();
        this.setFood();
        this.setField();
        this.setAnts();
    }

    canvasInit() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        document.querySelector('body').appendChild(this.canvas);

        this.width = this.canvas.width = properties.bodySize;
        this.height = this.canvas.height = properties.bodySize;
    }

    drawCircle(x, y, radius, color) {
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, Math.PI * 2);
        this.context.closePath();
        this.context.fillStyle = color;
        this.context.fill();
    }

    getFieldInformation(positionX, positionY) {
        return this.field[Math.round(positionX / 3)][Math.round(positionY / 3)];
    }

//todo: add html object instead of draw it
    redrawBackground() {
        this.context.fillStyle = properties.backgroundBorderColor;
        this.context.fillRect(0, 0, this.width, this.height);

        this.context.fillStyle = properties.backgroundColor;
        this.context.fillRect(BORDER_WIDTH, BORDER_WIDTH, this.width - BORDER_WIDTH * 2, this.height - BORDER_WIDTH * 2);
    }

    redrawAnthill() {
        this.drawCircle(this.anthill[POSITION_X], this.anthill[POSITION_Y], this.anthill[RADIUS], redColor);
    }

    redrawFood() {
        for (let i = 0; i < this.food.length; i++) {
            this.drawCircle(this.food[i][POSITION_X], this.food[i][POSITION_Y], this.food[i][RADIUS], greenColor);
        }
    }

    redrawAnts() {
        for (let ant of this.ants) {
            ant.move();
            ant.redraw();
        }
    }

//todo #NOT_TODO: don't touch please
    redrawTracks() {
        for (let track of this.tracks.values()) {
            track.clearTrack();
            track.redraw();
        }
    }

    /*loop() {
        if (stop) return;

        this.redrawBackground();
        this.redrawAnthill();
        this.redrawFood();
        this.redrawAnts();
        this.redrawTracks();

        requestAnimationFrame(this.loop);
    }*/

    setField() {
        //let this.field = new Array(500).fill(new Array(500).fill([]));
        for (let i = 0; i < properties.gridSize; i++) {
            this.field[i] = [];
            for (let j = 0; j < properties.gridSize; j++) {
                this.field[i][j] = new Map;
            }
        }
    }

    setAnts() {
        for (let i = 0; i < properties.antCount; i++) {
            this.ants.push(new Ants(this));
        }
    }

//destination of this.anthills todo: add the ability to choose position
    setFood() {
        this.food.push(
            {
                'positionX': properties.foodSize + 10, 'positionY': properties.foodSize + 10,
                'radius': properties.foodSize,
                'worth': 50
            }
        );

        this.food.push(
            {
                'positionX': properties.bodySize - properties.foodSize - 10,
                'positionY': properties.bodySize - properties.foodSize - 10,
                'radius': properties.foodSize / 2,
                'worth': 20
            }
        );
    }

//destination of this.anthills todo: add the ability to choose position
    setAnthill() {
        Object.assign(
            this.anthill,
            {'positionX': properties.bodySize / 2, 'positionY': properties.bodySize / 2},
            {'radius': properties.anthillSize},
            {'worth': 100}
        );
    }
}

let stop = false;
let antSimulation = new AntsSimulation();

Array.prototype.last = function () {
    return this[this.length - 1];
}

function loop(){
    if (stop) return;

    antSimulation.redrawBackground();
    antSimulation.redrawAnthill();
    antSimulation.redrawFood();
    antSimulation.redrawAnts();
    antSimulation.redrawTracks();

    requestAnimationFrame(loop);
}

document.querySelector(".button-start").addEventListener(CLICK, () => {
    stop = false;
    loop();
});

document.querySelector(".button-stop").addEventListener(CLICK, () => {
    stop = true;
});
