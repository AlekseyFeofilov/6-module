let wallsFlag = false;
let freeSpaceFlag = false;
let startFlag = false;
let finishFlag = false;

function colorCell() {
    if(wallsFlag) {
        event.target.style.backgroundColor = "#777777FF";
    }
    else if(freeSpaceFlag) {
        event.target.style.backgroundColor = "white";
    }
    else if(startFlag) {
        event.target.style.backgroundColor = "#FF64EEFF";
    }
    else if(finishFlag) {
        event.target.style.backgroundColor = "#6F92FFFF";
    }
}

walls.onclick = function() {
    wallsFlag = true;
    freeSpaceFlag = false;
    startFlag = false;
    finishFlag = false;
}

free.onclick = function() {
    freeSpaceFlag = true;
    wallsFlag = false;
    startFlag = false;
    finishFlag = false;
}

start.onclick = function() {
    startFlag = true;
    freeSpaceFlag = false;
    wallsFlag = false;
    finishFlag = false;
}

finish.onclick = function() {
    finishFlag = true;
    freeSpaceFlag = false;
    wallsFlag = false;
    startFlag = false;
}

let buttonDirect = document.getElementById("direct");
let buttonDiagonal = document.getElementById("diagonal");

let diagonalHeuristic = false;

// Функции выбора эвристики
direct.onclick = function() {
    diagonalHeuristic = false;
    buttonDiagonal.style.backgroundColor = "white";
    buttonDirect.style.backgroundColor = "#97ffed";
}

diagonal.onclick = function() {
    diagonalHeuristic = true;
    buttonDirect.style.backgroundColor = "white";
    buttonDiagonal.style.backgroundColor = "#97ffed";
}