import {properties} from "../properties.js";
import {BORDER_WIDTH, POSITION_X, POSITION_Y, RADIUS} from "../constants.js";
import {greenColor, redColor} from "../extension/enum.js";
import {Ants} from "./ant.js";

export {AntSimulation}

class AntSimulation {
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