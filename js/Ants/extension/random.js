import {POSITION_X, POSITION_Y} from "./strings.js";

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function RandomPosition(x1, y1, x2, y2) {
    this[POSITION_X] = random(x1, x2);
    this[POSITION_Y] = random(y1, y2);
}

export {random, RandomPosition};