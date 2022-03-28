import {random, RandomPosition} from "./extension/random.js";
import {isRed, isGreen, isGrey} from "./extension/color.js";
import {properties} from "./properties.js";
import {redColor, greenColor} from "./extension/enum.js";
import {ANTHILL, FOOD, POSITION_X, POSITION_Y, CLICK, RADIUS, BORDER_WIDTH, ANGLE} from "./constants.js";

let stop = false;

Array.prototype.last = function () {
    return this[this.length - 1];
}

document.querySelector(".button-start").addEventListener(CLICK, () => {
    algorithm();
});

document.querySelector(".button-stop").addEventListener(CLICK, () => {
    stop = true;
});

function algorithm() {
    let anthill = {};
    let tracks = new Map;

    let food = [];
    let ants = [];
    let field = [];

    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    document.querySelector('body').appendChild(canvas);

    const width = canvas.width = properties.bodySize;
    const height = canvas.height = properties.bodySize;

    class Track {
        constructor(status, worth, ID) {
            this.pheromones = [];
            //todo: реализовать подсчёт муравьев
            this.ID = ID;

            this.status = status;
            this.worth = worth;
            this.complete = false;

            this.previousAntNumber = 0;
            this.curretnAntNumber = 0;
        }

        destroy() {
            tracks.delete(this.ID);
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
                getFieldInformation(pheromone.positionX, pheromone.positionY).delete(this.ID);
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

            drawCircle(
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
        constructor() {
            this.direction = random(0, Math.PI * 2);
            this.positionX = anthill[POSITION_X] + Math.cos(this.direction) * anthill[RADIUS];
            this.positionY = anthill[POSITION_Y] + Math.sin(this.direction) * anthill[RADIUS];

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
            return context.getImageData(positionX, positionY, 1, 1).data
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

            tracks.get(this.trackID).finish();
            this.setTrack();
        }

        setTrack() {
            this.trackID = Symbol();
            tracks.set(this.trackID, new Track(this.notStatus, this.worth, this.trackID));
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
                let track = tracks.get(trackID);

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

            this.direction = tracks.get(trackID).pheromones[pheromoneIndex].direction;

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
            let currentPosition = getFieldInformation(this.positionX, this.positionY)
            currentPosition.set(this.trackID, tracks.get(this.trackID).pheromones.length - 1)
        }

        makePheromone() {
            if (this.pheromoneNumber < 0) return;

            this.pheromoneNumber--;

            if (getFieldInformation(this.positionX, this.positionY).size > 25 ||
                getFieldInformation(this.positionX, this.positionY).has(this.trackID)) {
                return;
            }

            if (this.pheromoneNumber % properties.pheromoneFrequency !== 0) return;

            tracks.get(this.trackID).addPheromone(this);

            this.spreadPheromone();
        }

        move() {
            food.forEach(food => {
                if (this.isItNear(this.positionX, this.positionY, food) && this.status === FOOD) {
                    this.changeStatus(food['worth']);
                }
            });

            if (this.isItNear(this.positionX, this.positionY, anthill) && this.status === ANTHILL) {
                this.changeStatus(anthill['worth']);
            }

            let currentPheromones = getFieldInformation(this.positionX, this.positionY);

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
            drawCircle(
                this.positionX,
                this.positionY,
                properties.antSize,
                properties.antColor);
        }
    }

    function drawCircle(x, y, radius, color) {
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.closePath();
        context.fillStyle = color;
        context.fill();
    }

    function getFieldInformation(positionX, positionY) {
        return field[Math.round(positionX / 3)][Math.round(positionY / 3)];
    }

//todo: add html object instead of draw it
    function redrawBackground() {
        context.fillStyle = properties.backgroundBorderColor;
        context.fillRect(0, 0, width, height);

        context.fillStyle = properties.backgroundColor;
        context.fillRect(BORDER_WIDTH, BORDER_WIDTH, width - BORDER_WIDTH * 2, height - BORDER_WIDTH * 2);
    }

    function redrawAnthill() {
        drawCircle(anthill[POSITION_X], anthill[POSITION_Y], anthill[RADIUS], redColor);
    }

    function redrawFood() {
        for (let i = 0; i < food.length; i++) {
            drawCircle(food[i][POSITION_X], food[i][POSITION_Y], food[i][RADIUS], greenColor);
        }
    }

    function redrawAnts() {
        for (let ant of ants) {
            ant.move();
            ant.redraw();
        }
    }

//todo #NOT_TODO: don't touch please
    function redrawTracks() {
        for (let track of tracks.values()) {
            track.clearTrack();
            track.redraw();
        }
    }

    function reset() {
        if (stop) {
            /*
                        pheromones.length = 0;
                        ants.length = 0;
                        field.length = 0;
            */
            document.querySelector('body').removeChild(canvas);

            stop = false;
            return true;
        }

        return false;
    }

    function loop() {
        if (reset()) return;

        redrawBackground();
        redrawAnthill();
        redrawFood();
        redrawAnts();
        redrawTracks();

        requestAnimationFrame(loop);
    }

    function setField() {
        //let field = new Array(500).fill(new Array(500).fill([]));
        for (let i = 0; i < properties.gridSize; i++) {
            field[i] = [];
            for (let j = 0; j < properties.gridSize; j++) {
                field[i][j] = new Map;
            }
        }
    }

    function setAnts() {
        for (let i = 0; i < properties.antCount; i++) {
            ants.push(new Ants);
        }
    }

//destination of anthills todo: add the ability to choose position
    function setFood() {
        /*        food.push(
                    new RandomPosition(
                        properties.foodSize,
                        properties.foodSize,
                        properties.bodySize - properties.foodSize,
                        properties.bodySize - properties.foodSize
                    ),
                    {'radius': properties.foodSize},
                    {'worth': 20}
                );*/

        food.push(
            {
                'positionX': properties.foodSize + 10, 'positionY': properties.foodSize + 10,
                'radius': properties.foodSize,
                'worth': 50
            }
        );

        food.push(
            {
                'positionX': properties.bodySize - properties.foodSize - 10,
                'positionY': properties.bodySize - properties.foodSize - 10,
                'radius': properties.foodSize / 2,
                'worth': 20
            }
        );
    }

//destination of anthills todo: add the ability to choose position
    function setAnthill() {
        Object.assign(
            anthill,
            {'positionX': properties.bodySize / 2, 'positionY': properties.bodySize / 2},
            {'radius': properties.anthillSize},
            {'worth': 100}
        );
    }

    function init() {
        setAnthill();
        setFood();
        setField();
        setAnts();

        loop();
    }

    init();
}
