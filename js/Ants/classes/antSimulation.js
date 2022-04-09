import {properties} from "../properties.js";
import {Ants} from "./ant.js";
import {appendCanvas, createAnthill} from "../script.js";

export {AntSimulation}

class AntSimulation {
    constructor(borderContext) {
        this.borderContext = borderContext;

        this.objectsInit();
        this.canvasInit();

        this.setField();
        this.canvasInit();
    }

    objectsInit(){
        this.tact = 0;
        this.anthill = {};
        this.tracks = new Map;

        this.food = [];
        this.ants = [];
        this.field = [];
    }

    //todo: rename
    start(){
        if (this.anthill.positionX === undefined) {
            createAnthill(properties.bodySize / 2, properties.bodySize / 2);
        }

        this.setAnts();
    }

    canvasInit() {
        this.antCanvas = document.createElement('canvas');
        this.antContext = this.antCanvas.getContext('2d');

        this.pheromoneCanvas = document.createElement('canvas');
        this.pheromoneContext = this.pheromoneCanvas.getContext('2d');

        appendCanvas(this.antCanvas);
        appendCanvas(this.pheromoneCanvas);
    }

    getFieldInformation(positionX, positionY) {
        return this.field[Math.round(positionX / 3)][Math.round(positionY / 3)];
    }

    redrawAnts() {
        this.antContext.clearRect(
            properties.borderSize,
            properties.borderSize,
            properties.bodySize - properties.borderSize * 2,
            properties.bodySize - properties.borderSize * 2
        );

        for (let ant of this.ants) {
            ant.move();
            ant.redraw();
        }
    }

    redrawTracks() {
        if(this.tact === 0) {
            this.pheromoneContext.clearRect(
                properties.borderSize,
                properties.borderSize,
                properties.bodySize - properties.borderSize * 2,
                properties.bodySize - properties.borderSize * 2
            );
        }

        for (let track of this.tracks.values()) {
            track.clearTrack();
            track.update();

            if(this.tact === 0) {
                track.redraw();
            }
        }

        this.tact = (this.tact + 1) % 5;
    }

    loop() {
        this.redrawAnts();
        this.redrawTracks();
    }

    setField() {
        this.field = new Array(500)
            .fill()
            .map(() => new Array(500)
                .fill()
                .map(() => new Map));
    }

    setAnts() {
        for (let i = 0; i < properties.antCount; i++) {
            this.ants.push(new Ants(this));
        }
    }

    setFood(food) {
        this.food = food;
    }

    setAnthill(anthill) {
        this.anthill = anthill;
    }

    clearCanvases(){
        this.antContext.clearRect(0, 0, this.antCanvas.width, this.antCanvas.height)
        this.pheromoneContext.clearRect(0, 0, this.antCanvas.width, this.antCanvas.height)
    }
}