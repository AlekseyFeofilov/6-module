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
    let food = {};

    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    document.querySelector('body').appendChild(canvas);

    //todo: maybe more space? maybe round in 9 time
    const width = canvas.width = 300;
    const height = canvas.height = 300;

    let ants = [];
    let pheromones = [];
    let field = [];

    //todo: add more options
    class Pheromone {
        constructor(positionX, positionY, distance, status, previousPheromone, direction) {
            this.positionX = positionX;
            this.positionY = positionY;

            this.previousPheromone = previousPheromone;

            this.direction = direction + Math.PI;
            this.status = status;
            this.lifeCycle = distance * 20;
        }

        //todo #NOT_TODO: It's okay
        lifeDecrease() {
            this.lifeCycle -= properties.pheromoneLifeCycleStep;
        }

        //todo: add more clear factor (coefficient) to color bright
        redraw() {
            this.lifeDecrease();

            drawCircle(
                this.positionX,
                this.positionY,
                properties.pheromoneSize,
                this.status === FOOD ?
                    `rgba(40, 255, 40, ${this.lifeCycle /
                    (properties.pheromoneLifeCycle * properties.pheromoneLifeCycleCoefficient)})`
                    : `rgba(255, 40, 40, ${this.lifeCycle /
                    (properties.pheromoneLifeCycle * properties.pheromoneLifeCycleCoefficient)})`
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
            this.pheromonesCount = properties.pheromoneOpacity;
            this.lastPheromone = undefined;
        }

        //todo #NOT_TODO: it's okay
        getPositionX(angle) {
            return this.positionX + Math.cos(angle) * properties.antSpeed;
        }

        //todo #NOT_TODO: it's okay
        getPositionY(angle) {
            return this.positionY + Math.sin(angle) * properties.antSpeed;
        }

        //todo #NOT_TODO: it's okay
        isItNear(positionX, positionY, object) {
            return Math.abs(positionX - object[POSITION_X]) < object[RADIUS] &&
                Math.abs(positionY - object[POSITION_Y]) < object[RADIUS]
        }

        //todo #NOT_TODO: it's okay
        changeStatus() {
            [this.status, this.notStatus] = [this.notStatus, this.status];
            this.pheromonesCount = properties.pheromoneOpacity;
            this.lastPheromone = undefined;
            this.direction += Math.PI;
        }

        moveToRandomDirection() {
            this.direction += random(-properties.antConservatism, properties.antConservatism);

            while (isGrey(context.getImageData(this.getPositionX(this.direction), this.getPositionY(this.direction), 1, 1).data)) {
                this.direction = random(0, Math.PI * 2);
            }

            this.positionX = this.getPositionX(this.direction);
            this.positionY = this.getPositionY(this.direction);
        }

        calculateProbability(currentPheromones) {
            let totalPheromoneStrength = 0
            let localPheromoneStrengths = [];

            //todo: change logic to previous position from pheromone
            for (let i = 0; i < currentPheromones.length; i++) {
                if (currentPheromones[i].previousPheromone !== undefined) {
                    let nextPositionX = currentPheromones[i].previousPheromone.positionX;
                    let nextPositionY = currentPheromones[i].previousPheromone.positionY;
                    let pheromoneCount = getFieldInformation(nextPositionX, nextPositionY, this.status).length;
                    let pheromoneCost = currentPheromones[i].lifeCycle;
                    localPheromoneStrengths.push(pheromoneCost ** properties.antGreed * pheromoneCount ** properties.antConformism);
                    totalPheromoneStrength += localPheromoneStrengths.last();
                } else {
                    currentPheromones.splice(i--, 1);
                }
            }

            if (localPheromoneStrengths.length === 0) {
                return [];
            }

            localPheromoneStrengths = localPheromoneStrengths.map(value => value / totalPheromoneStrength)

            return localPheromoneStrengths;
        }

        setRandomDecision(currentPheromones, probabilities) {
            if (probabilities.length === 0) {
                this.moveToRandomDirection();
                return;
            }

            let randomNumber = random(0, 1);
            let probability = 0;
            let next = 0;

            while (probability < randomNumber || next < probabilities.length) {
                probability += probabilities[next++];
            }

            /*if(currentPheromones[next] === undefined ||
                currentPheromones[next].previousPheromone === undefined){
                this.moveToRandomDirection();
                return;
            }*/

            let nextPheromone = currentPheromones[--next].previousPheromone;

            this.direction = nextPheromone.direction;
            this.positionX = this.getPositionX(this.direction);
            this.positionY = this.getPositionY(this.direction);
        }

        spreadPheromone(shiftX, shiftY) {
            if (getFieldInformation(
                this.positionX + shiftX,
                this.positionY + shiftY,
                this.notStatus
            ).length > 25) return;

            getFieldInformation(
                this.positionX + shiftX,
                this.positionY + shiftY,
                this.notStatus
            ).push(this.lastPheromone);
        }

        makePheromone() {
            if (this.pheromonesCount < 0) return;

            this.pheromonesCount--;

            if (getFieldInformation(this.positionX, this.positionY, this.status).length > 25) {
                return;
            }


            if (this.pheromonesCount % properties.pheromoneFrequency !== 0) return;

            pheromones.push(new Pheromone(
                this.positionX, this.positionY,
                this.pheromonesCount,
                (this.status === ANTHILL) ? FOOD : ANTHILL,
                this.lastPheromone,
                this.direction));

            this.lastPheromone = pheromones.last();

            this.spreadPheromone(0, 0);
            this.spreadPheromone(0, 1);
            this.spreadPheromone(1, 0);
            this.spreadPheromone(1, 1);
            /*
                        this.spreadPheromone(0, -1);
                        this.spreadPheromone(-1, 0);
                        this.spreadPheromone(-1, -1);
                        this.spreadPheromone(-1, 1);
                        this.spreadPheromone(1, -1);
            */
        }

        move() {
            //todo
            if (this.isItNear(this.positionX, this.positionY, food) && this.status === FOOD ||
                this.isItNear(this.positionX, this.positionY, anthill) && this.status === ANTHILL
            ) {
                this.changeStatus();
                //this.direction += Math.PI;
            }

            let currentPheromones = getFieldInformation(this.positionX, this.positionY, this.status);

            //todo: add to properties
            if (currentPheromones.length === 0 || 1 / currentPheromones.length > random(0, 1)) {
                this.moveToRandomDirection();
            } else {
                let probabilities = this.calculateProbability(currentPheromones);
                this.setRandomDecision(currentPheromones, probabilities);
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


    //todo: DON'T TOUCH. THERE WERE ALL RIGHT


    //todo #NOT_TODO: don't touch please NEVER
    function drawCircle(x, y, radius, color) {
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.closePath();
        context.fillStyle = color;
        context.fill();
    }

    //todo #NOT_TODO: don't touch please NEVER
    function getFieldInformation(positionX, positionY, status) {
        return field[Math.round(positionX)][Math.round(positionY)][status];
    }

    //todo #NOT_TODO: have nothing that can break it
    //todo: add html object instead of draw it
    function redrawBackground() {
        context.fillStyle = properties.backgroundBorderColor;
        context.fillRect(0, 0, width, height);

        context.fillStyle = properties.backgroundColor;
        context.fillRect(BORDER_WIDTH, BORDER_WIDTH, width - BORDER_WIDTH * 2, height - BORDER_WIDTH * 2);
    }

    //todo #NOT_TODO: don't touch please NEVER
    function redrawAnthill() {
        drawCircle(anthill[POSITION_X], anthill[POSITION_Y], anthill[RADIUS], redColor);
    }

    //todo #NOT_TODO: don't touch please NEVER
    function redrawFood() {
        drawCircle(food[POSITION_X], food[POSITION_Y], food[RADIUS], greenColor);
    }

    //todo #NOT_TODO: don't touch please NEVER
    function redrawAnts() {
        for (let ant of ants) {
            ant.move();
            ant.redraw();
        }
    }

    //todo #NOT_TODO: don't touch please
    function redrawPheromones() {
        for (let i = 0; i < pheromones.length; i++) {
            let pheromone = pheromones[i];
            if (pheromone.lifeCycle < 0) {
                let pheromonePosition = getFieldInformation(pheromone.positionX, pheromone.positionY, pheromone.status)
                pheromonePosition.splice(pheromonePosition.findIndex(it => it === pheromone), 1);
                pheromones.splice(i--, 1);
                continue;
            }

            pheromone.redraw();
        }
    }

    //todo #NOT_TODO: don't touch please
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

    //todo #NOT_TODO: don't touch please NEVER
    function loop() {
        if (reset()) return;

        redrawBackground();
        redrawAnthill();
        redrawFood();
        redrawAnts();
        redrawPheromones();

        requestAnimationFrame(loop);
    }

    //todo #NOT_TODO: don't touch please NEVER
    function setField() {
        //let field = new Array(500).fill(new Array(500).fill([]));
        for (let i = 0; i < properties.gridSize; i++) {
            field[i] = [];
            for (let j = 0; j < properties.gridSize; j++) {
                field[i][j] = {[ANTHILL]: [], [FOOD]: []};
            }
        }
    }

    //todo #NOT_TODO: don't touch please NEVER
    function setAnts() {
        for (let i = 0; i < properties.antCount; i++) {
            ants.push(new Ants);
        }
    }

    //todo #NOT_TODO: have nothing that can break it
    //destination of anthills todo: add the ability to choose position
    function setFood() {
        Object.assign(
            food,
            new RandomPosition(
                properties.foodSize,
                properties.foodSize,
                properties.bodySize - properties.foodSize,
                properties.bodySize - properties.foodSize
            ),
            {'radius': properties.foodSize}
        );
    }

    //todo #NOT_TODO: have nothing that can break it
    //destination of anthills todo: add the ability to choose position
    function setAnthill() {
        Object.assign(
            anthill,
            {'positionX': properties.bodySize / 2, 'positionY': properties.bodySize / 2},
            {'radius': properties.anthillSize}
        );
    }

    //todo #NOT_TODO: don't touch please NEVER
    function init() {
        setAnthill();
        setFood();
        setAnts();
        setField();

        loop();
    }

    init();
}
