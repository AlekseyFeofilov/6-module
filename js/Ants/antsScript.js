import {CLICK} from "./constants.js";
import {AntSimulation} from "./classes/antSimulation.js";

let stop = false;
let antSimulation = new AntSimulation();

Array.prototype.last = function () {
    return this[this.length - 1];
}

function loop(){
    if (stop) return;

    antSimulation.redrawBackground();
    antSimulation.redrawAnthill();
    antSimulation.redrawFood();
    antSimulation.redrawAnts();
    antSimulation.redrawTracks();

    requestAnimationFrame(loop);
}

document.querySelector(".button-start").addEventListener(CLICK, () => {
    stop = false;
    document.querySelector('.frame').style.border = "none";
    loop();
});

document.querySelector(".button-stop").addEventListener(CLICK, () => {
    stop = true;
});
