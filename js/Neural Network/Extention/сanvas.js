function clearCanvas(contexts) {
    contexts.forEach(context => context.clearRect(0, 0, context.canvas.width, context.canvas.height));
}

function repeatCanvasImage(from, to) {
    to.clearRect(0, 0, to.canvas.width, to.canvas.height);
    to.drawImage(from.canvas, 0, 0, to.canvas.width, to.canvas.height);
}

function convertCanvasToPixelData(canvas, context) {
    let pixelData = new Array(canvas.height * canvas.width);

    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            pixelData[y * canvas.width + x] = context.getImageData(x, y, 1, 1).data[3] / 255;
        }
    }

    return pixelData;
}

export {clearCanvas, convertCanvasToPixelData, repeatCanvasImage}