import {clear, draw, pixelDraw, startDraw, stopDrawing} from "./Extention/drawing.js";
import {DigitRecognizer} from "./Extention/digitRecognizer.js";
import {Matrix} from "./Math/Matrix.js";
import {dataNetwork} from "./Data/properties.js";
import {repeatCanvasImage, convertCanvasToPixelData, clearCanvas} from "./Extention/сanvas.js";

let drawCanvas = document.createElement('canvas');
let drawContext = drawCanvas.getContext('2d');

let neuralCanvas = document.createElement('canvas');
let neuralContext = neuralCanvas.getContext('2d');

let demonstrationCanvas = document.createElement('canvas');
let demonstrationContext = demonstrationCanvas.getContext('2d');

let drawStatus = "";
let drawing = false;
let mouse = {x: 0, y: 0};

let offset = {
    offsetLeft: document.querySelector(".work-space").offsetLeft + 6,
    offsetTop: document.querySelector(".draw-space").offsetTop + 1
};

let digitRecognizer = new DigitRecognizer();

appendCanvas();

function appendCanvas() {
    let frame = document.querySelector('.draw-space');
    frame.appendChild(drawCanvas);

    drawCanvas.width = frame.clientWidth + 3;
    drawCanvas.height = frame.clientHeight + 1;

    frame = document.querySelector(".neural-network-view.display")
    frame.appendChild(demonstrationCanvas);
    frame.appendChild(neuralCanvas);

    demonstrationCanvas.width = frame.clientWidth;
    demonstrationCanvas.height = frame.clientHeight;

    neuralCanvas.width = neuralCanvas.height = 28;
}

function showAnswer(answer) {
    let display = document.querySelector(".reply.display");
    switch (answer) {
        case 0:
            display.style.backgroundImage = `url("../js/Neural Network/Image/mnist zero.png")`;
            break;
        case 1:
            display.style.backgroundImage = `url("../js/Neural Network/Image/mnist one.png")`;
            break;
        case 2:
            display.style.backgroundImage = `url("../js/Neural Network/Image/mnist two.png")`;
            break;
        case 3:
            display.style.backgroundImage = `url("../js/Neural Network/Image/mnist three.png")`;
            break;
        case 4:
            display.style.backgroundImage = `url("../js/Neural Network/Image/mnist four.png")`;
            break;
        case 5:
            display.style.backgroundImage = `url("../js/Neural Network/Image/mnist five.png")`;
            break;
        case 6:
            display.style.backgroundImage = `url("../js/Neural Network/Image/mnist six.png")`;
            break;
        case 7:
            display.style.backgroundImage = `url("../js/Neural Network/Image/mnist seven.png")`;
            break;
        case 8:
            display.style.backgroundImage = `url("../js/Neural Network/Image/mnist eight.png")`;
            break;
        case 9:
            display.style.backgroundImage = `url("../js/Neural Network/Image/mnist nine.png")`;
            break;
    }
}

function setScaleWidth(selector, value) {
    let scale = document.querySelector(selector);
    scale.style.width = `${40 * value}px`;

    if (40 * value < 10) {
        scale.style.backgroundColor = "red"
    } else if (40 * value < 25) {
        scale.style.backgroundColor = "yellow"
    } else {
        scale.style.backgroundColor = "green";
    }
}

function showOutput(output) {
    setScaleWidth(".scale-zero", output[0]);
    setScaleWidth(".scale-one", output[1]);
    setScaleWidth(".scale-two", output[2]);
    setScaleWidth(".scale-three", output[3]);
    setScaleWidth(".scale-four", output[4]);
    setScaleWidth(".scale-five", output[5]);
    setScaleWidth(".scale-six", output[6]);
    setScaleWidth(".scale-seven", output[7]);
    setScaleWidth(".scale-eight", output[8]);
    setScaleWidth(".scale-nine", output[9]);
}

function handleOutput(output) {
    showAnswer(output.answer);
    showOutput(output.output);
}

function recognize() {
    let input = convertCanvasToPixelData(neuralCanvas, neuralContext);
    input = {pixels: Matrix.arrayTo2DSquareMatrix(input, true)};
    handleOutput(digitRecognizer.recognize(input));
}

function setNote(string) {
    let info = document.createElement("div");
    info.innerText = string;
    document.querySelector(".training-info").appendChild(info);
}

function dataCheck(layerCount, epochCount, layerSize){
    dataNetwork.epochCount = (epochCount <= 0) ? 20 : Math.round(epochCount);
    dataNetwork.layerSize = (layerSize === "") ? [784, 256, 10] : JSON.parse(`[784, ${layerSize}, 10]`);
    dataNetwork.layerCount = dataNetwork.layerSize.length;
}

function setData() {
    let layerCount = +document.querySelector(".hidden-layer-value").value;
    let epochCount = +document.querySelector(".epoch-number-value").value;
    let layerSize = document.querySelector(".neuron-number-value").value;

    dataCheck(layerCount, epochCount, layerSize);
}

export function report(time) {
    setNote(`${digitRecognizer.epoch}th epoch in ${time}; accuracy: ${digitRecognizer.accuracy[digitRecognizer.accuracy.length - 1]}`);
}

export function completeReport(time) {
    setNote(`\nCompleted at ${new Date().getHours()}h ${new Date().getMinutes()}m in ${time}\n\n`);
}

drawCanvas.addEventListener('mousedown', event => {
    switch (drawStatus) {
        case "draw":
            startDraw(event, drawContext, mouse, offset);
            drawing = true;
            break;

        case "pixelDraw":
        case "clear":
            drawing = true;
            break;
    }
});

drawCanvas.addEventListener('mousemove', event => {
    if (drawing) {
        switch (drawStatus) {
            case "draw":
                draw(event, drawContext, mouse, offset);
                break;

            case "clear":
                clear(event, drawContext, mouse, offset);
                break;

            case "pixelDraw":
                pixelDraw(event, drawContext, mouse, offset);
                break;
        }

        repeatCanvasImage(drawContext, neuralContext);
        repeatCanvasImage(neuralContext, demonstrationContext);

        recognize();
    }
});

drawCanvas.addEventListener('mouseup', event => {
    if (drawing) {
        drawing = false;

        if (drawStatus === "draw") {
            stopDrawing(event, drawContext);
        }
    }
});

drawCanvas.addEventListener('mouseout', event => {
    if (drawing) {
        drawing = false;

        if (drawStatus === "draw") {
            stopDrawing(event, drawContext);
        }
    }
});

document.onkeydown = event => {
    switch (event.code) {
        case 'KeyA':
            clearCanvas([drawContext, neuralContext, demonstrationContext]);
            break;

        case 'KeyC':
            drawStatus = "clear"
            break;

        case 'KeyD':
            drawStatus = "draw"
            break;

        case 'KeyI':
            digitRecognizer.delayTraining();
            digitRecognizer.synchronize();
            break;

        case 'KeyP':
            drawStatus = "pixelDraw"
            break;
    }
}

document.querySelector(".clear-all").addEventListener("click", () =>
    clearCanvas([drawContext, neuralContext, demonstrationContext])
);

document.querySelector(".draw-button").addEventListener("click", () => drawStatus = "draw");

document.querySelector(".clear-button").addEventListener("click", () => drawStatus = "clear");

document.querySelector(".button-download").addEventListener("click", () => {
    digitRecognizer.delayTraining();
    digitRecognizer.synchronize();
});

document.querySelector(".button-training").addEventListener("click", () => {
    setData();
    setNote(`Neural network started at ${new Date().getHours()}h ${new Date().getMinutes()}m
    info: ${dataNetwork.epochCount} epoch, ${JSON.stringify(dataNetwork.layerSize)} layers\n\n`)

    digitRecognizer = new DigitRecognizer();
    digitRecognizer.train();
});

document.querySelector(".button-stop-training").addEventListener("click", () => {
    digitRecognizer.delayTraining();
    setNote(`paused\n`);
});

document.querySelector(".button-continue-training").addEventListener("click", () => {
    digitRecognizer.continueTraining();
    setNote(`continued\n`)
});

