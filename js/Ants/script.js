import {
    ANTHILL,
    BORDER,
    BORDER_SIZE,
    CLICK,
    FOOD,
    MOUSEDOWN,
    MOUSEMOVE,
    MOUSEOUT,
    MOUSEUP,
    NUTRITIONAL_VALUE
} from "./strings.js";
import {AntSimulation} from "./classes/antSimulation.js";
import {properties} from "./properties.js";
import {circleDrawing, draw, startDraw, stopDrawing} from "./extension/drawing.js";
import {greenColor, greyColor, redColor} from "./extension/enum.js";

let mainCanvas = document.createElement('canvas');
let mainContext = mainCanvas.getContext('2d');

let tempCanvas = document.createElement('canvas');
let tempContext = tempCanvas.getContext('2d');

appendCanvas(mainCanvas);
appendCanvas(tempCanvas);

setFrontendCanvasClass(mainCanvas);
setFrontendCanvasClass(tempCanvas);

let drawStatus = false;
let actionStatus = "";
let stopAntSimulation = false;
let firstStart = true;

let antSimulation = new AntSimulation();
let anthill = {};
let food = [];

let mouse = {x: 0, y: 0};

document.querySelector(".button-start").addEventListener(CLICK, () => {
    stopAntSimulation = false;
    actionStatus = "";
    setDefaultCursor();

    if (firstStart) {
        antSimulation.start();
        firstStart = false;
    }

    loop();
});

document.querySelector(".button-stop").addEventListener(CLICK, () => {
    stopAntSimulation = true;
    setDefaultCursor();
});

document.querySelector(".button-set-anthill").addEventListener(CLICK, (event) => {
    actionStatus = ANTHILL;
    setCrosshairCursor()
});

document.querySelector(".button-set-food").addEventListener(CLICK, (event) => {
    actionStatus = FOOD;
    setCrosshairCursor();
});

document.querySelector(".button-set-border").addEventListener(CLICK, (event) => {
    actionStatus = BORDER;
    setDefaultCursor();
});

document.querySelector(".button-clear").addEventListener(CLICK, (event) => {
    actionStatus = "";
    food = [];
    anthill = {};
    setDefaultCursor();
    clearAllCanvases();

    stopAntSimulation = true;
    firstStart = true;
    antSimulation = new AntSimulation();
});

function appendCanvas(canvas) {
    document.querySelector('.frame').appendChild(canvas);
    canvas.width = properties.bodySize;
    canvas.height = properties.bodySize;
}

function setFrontendCanvasClass(canvas) {
    canvas.classList.add('frontend-canvas')
}

function clearAllCanvases() {
    clearCanvas(tempCanvas, tempContext);
    clearCanvas(mainCanvas, mainContext);
    antSimulation.clearCanvas();
}

function clearCanvas(canvas, context) {
    context.clearRect(0, 0, canvas.width, canvas.height)
}

function setDefaultCursor() {
    tempCanvas.style.cssText = "cursor: default;"
}

function setCrosshairCursor() {
    tempCanvas.style.cssText = "cursor: crosshair;"
}

function loop() {
    if (stopAntSimulation) return;

    antSimulation.loop();
    requestAnimationFrame(loop);
}

export function createAnthill(positionX, positionY) {
    mainContext.clearRect(
        anthill.positionX - properties.anthillSize,
        anthill.positionY - properties.anthillSize,
        anthill.radius * 2,
        anthill.radius * 2
    );

    anthill = {
        'positionX': positionX, 'positionY': positionY,
        'radius': properties.anthillSize,
        'worth': 100
    };

    antSimulation.setAnthill(anthill);
}

function createFood(positionX, positionY, radius, worth) {
    food.push({'positionX': positionX, 'positionY': positionY, 'radius': radius, 'worth': worth});
    antSimulation.setFood(food);
}

function goThrowInterval(min, max, value){
    return Math.min(Math.max(min, value), max);
}

tempCanvas.addEventListener(MOUSEDOWN, event => {
    let positionX, positionY;

    switch (actionStatus) {
        case BORDER:
            let borderSize = document.getElementById(BORDER_SIZE).value;
            tempContext.clearRect(mouse.x - borderSize, mouse.y - borderSize, borderSize * 3, borderSize * 3);
            startDraw(event, mainContext, mainCanvas, mouse)
            drawStatus = true;
            break;

        case ANTHILL:
            positionX = goThrowInterval(
                properties.anthillSize + properties.borderSize,
                mainCanvas.width - properties.anthillSize - properties.borderSize,
                mouse.x
            );
            positionY = goThrowInterval(
                properties.anthillSize + properties.borderSize,
                mainCanvas.height - properties.anthillSize - properties.borderSize,
                mouse.y
            );
            createAnthill(positionX, positionY);
            circleDrawing(positionX, positionY, properties.anthillSize, redColor, mainContext)
            break;

        case FOOD:
            let worth = document.getElementById(NUTRITIONAL_VALUE).value;
            let radius = 10 + worth / 5;
            positionX = goThrowInterval(
                radius + properties.borderSize,
                mainCanvas.width - radius - properties.borderSize,
                mouse.x
            );
            positionY = goThrowInterval(
                radius + properties.borderSize,
                mainCanvas.height - radius - properties.borderSize,
                mouse.y
            );
            createFood(positionX, positionY, radius, worth);
            circleDrawing(positionX, positionY, radius, greenColor, mainContext)
            break;
    }
});

tempCanvas.addEventListener(MOUSEMOVE, event => {
    switch (actionStatus) {
        case BORDER:
            if (drawStatus) {
                draw(event, mainContext, mainCanvas, mouse)
            }
            else{
                let borderSize = document.getElementById(BORDER_SIZE).value / 2;
                tempContext.clearRect(mouse.x - borderSize, mouse.y, borderSize * 3, borderSize * 3);

                mouse.x = event.pageX - tempCanvas.offsetLeft;
                mouse.y = event.pageY - tempCanvas.offsetTop;
                tempContext.fillStyle = greyColor;
                tempContext.fillRect(
                    mouse.x - 3 * borderSize / 4 - 5, mouse.y, borderSize * 2, borderSize * 2
                );
            }
            break;

        case ANTHILL:
            tempContext.clearRect(
                mouse.x - properties.anthillSize,
                mouse.y - properties.anthillSize,
                properties.anthillSize * 2,
                properties.anthillSize * 2
            );

            mouse.x = event.pageX - tempCanvas.offsetLeft;
            mouse.y = event.pageY - tempCanvas.offsetTop;
            circleDrawing(mouse.x, mouse.y, properties.anthillSize, 'rgba(255, 40, 40, 0.5)', tempContext);
            break;

        case FOOD:
            tempContext.clearRect(mouse.x - 30, mouse.y - 30, 60, 60);
            mouse.x = event.pageX - tempCanvas.offsetLeft;
            mouse.y = event.pageY - tempCanvas.offsetTop;
            let radius = 10 + document.getElementById(NUTRITIONAL_VALUE).value / 5;
            circleDrawing(mouse.x, mouse.y, radius, 'rgba(40, 255, 40, 0.5)', tempContext);
            break;
    }
});

tempCanvas.addEventListener(MOUSEUP, event => {
    if (drawStatus && actionStatus === BORDER) {
        stopDrawing(event, mainContext)
        drawStatus = false;
    }
});

tempCanvas.addEventListener(MOUSEOUT, event => {
    switch (actionStatus) {
        case BORDER:
            if (drawStatus) {
                stopDrawing(event, mainContext)
                drawStatus = false;
            }
            break;
        case ANTHILL:
        case FOOD:
            tempContext.clearRect(mouse.x - 30, mouse.y - 30, 60, 60)
            break;
    }
});

Array.prototype.last = function () {
    return this[this.length - 1];
}