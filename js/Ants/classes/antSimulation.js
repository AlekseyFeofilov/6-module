import {properties} from "../properties.js";
import {Ants} from "./ant.js";
import {createAnthill} from "../script.js";

export {AntSimulation}

class AntSimulation {
    constructor(borderContext) {
        this.borderContext = borderContext;

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
        this.setField();
    }

    //todo: rename
    start(){
        if (this.anthill.positionX === undefined) {
            createAnthill(properties.bodySize / 2, properties.bodySize / 2);
        }

        this.setAnts();
    }

    canvasInit() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        document.querySelector('.frame').appendChild(this.canvas);

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
        return this.field[Math.round(positionX / 6)][Math.round(positionY / 6)];
    }

//todo: add html object instead of draw it
    redrawBackground() {
        this.context.fillStyle = properties.backgroundColor;
        this.context.fillRect(
            properties.borderSize,
            properties.borderSize,
            this.width - properties.borderSize * 2,
            this.height - properties.borderSize * 2
        );
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

    loop() {
        this.redrawBackground();
        this.redrawAnts();
        //todo: separate redraw and update methods
        this.redrawTracks();
    }

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
    setFood(food) {
        this.food = food;
    }

//destination of this.anthills todo: add the ability to choose position
    setAnthill(anthill) {
        this.anthill = anthill;
    }

    clearCanvas(){
        this.context.clearRect(0, 0, this.width, this.height)
    }
}