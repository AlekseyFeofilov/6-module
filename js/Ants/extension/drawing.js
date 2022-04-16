import {greyColor} from "./enum.js";
import {BORDER_SIZE} from "./strings.js";

function startDraw(event, context, mouse, offset) {
    mouse.x = event.pageX - offset.offsetLeft;
    mouse.y = event.pageY - offset.offsetTop;

    context.beginPath();
    context.moveTo(mouse.x, mouse.y);

    context.strokeStyle = greyColor;
    context.lineWidth = document.getElementById(BORDER_SIZE).value;
}

function draw(event, context, mouse, offset) {
    mouse.x = event.pageX - offset.offsetLeft;
    mouse.y = event.pageY - offset.offsetTop;

    context.lineTo(mouse.x, mouse.y);
    context.stroke();
}

function stopDrawing(event, context) {
    context.closePath();
}

function circleDrawing(x, y, radius, color, context) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.closePath();
    context.fillStyle = color;
    context.fill();
}

export {stopDrawing, draw, startDraw, circleDrawing}