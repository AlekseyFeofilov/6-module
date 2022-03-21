class Point {
    constructor(x, y) {
        this.firstValue = x;
        this.secondValue = y;
    }
}

// Функция, создающая матрицу размером numberOfRows*numberOfRows на основе начальной матрицы
function generateNewMatrix(adjacencyMatrix, matrix, numberOfRows, numberOfColumns) {
    for (let i = 0; i < numberOfRows * numberOfColumns; i++) {
        for(let j = 0; j < numberOfRows * numberOfColumns; j++) {
            matrix[i][j] = 0;
        }
    }
    for (let i = 0; i < numberOfRows; i++) {
        for (let j = 0; j < numberOfColumns; j++) {
            if(i + 1 < numberOfRows && adjacencyMatrix[i + 1][j]) {
                matrix[i * numberOfColumns + j][(i + 1) * numberOfColumns + j] = 1;
            }
            if(0 <= i - 1 && adjacencyMatrix[i - 1][j]) {
                matrix[i * numberOfColumns + j][(i - 1) * numberOfColumns + j] = 1;
            }
            if(j + 1 < numberOfColumns && adjacencyMatrix[i][j + 1]) {
                matrix[i * numberOfColumns + j][i * numberOfColumns + j + 1] = 1;
            }
            if(0 <= j - 1 && adjacencyMatrix[i][j - 1]) {
                matrix[i * numberOfColumns + j][i * numberOfColumns + j - 1] = 1;
            }
            // Следующие строки используются для модификации алгоритма A* (Кроме как в соседние клетки,
            // можно ходить ещё и по диагонали)

            /*
            if(i + 1 < numberOfRows && j + 1 < numberOfColumns && adjacencyMatrix[i + 1][j + 1]) {
                matrix[i * numberOfColumns + j][(i + 1) * numberOfColumns + j + 1] = 1;
            }
            if(i + 1 < numberOfRows && 0 <= j - 1 && adjacencyMatrix[i + 1][j - 1]) {
                matrix[i * numberOfColumns + j][(i + 1) * numberOfColumns + j - 1] = 1;
            }
            if(0 <= i - 1 && j + 1 < numberOfColumns && adjacencyMatrix[i - 1][j + 1]) {
                matrix[i * numberOfColumns + j][(i - 1) * numberOfColumns + j + 1] = 1;
            }
            if(0 <= i - 1 && 0 <= j - 1 && adjacencyMatrix[i - 1][j - 1]) {
                matrix[i * numberOfColumns + j][(i - 1) * numberOfColumns + j - 1] = 1;
            }
             */
        }
    }
}

function heuristicFunction(startPoint, endPoint) {
    return Math.sqrt(Math.pow(startPoint.firstValue - endPoint.firstValue, 2) + Math.pow(startPoint.secondValue - endPoint.secondValue, 2));
}

function minHeuristicCost(openedPoints, heuristicCost) {
    let minElement = openedPoints[0];
    let minValue = heuristicCost[openedPoints[0]];
    for (let i = 1; i < openedPoints.length; i++) {
        if(heuristicCost[openedPoints[i]] < minValue) {
            minValue = heuristicCost[openedPoints[i]];
            minElement = openedPoints[i];
        }
    }
    return minElement;
}

function removeFromOpen(element, openedPoints) {
    let newOpen = [];
    for (let i = 0; i < openedPoints.length; i++) {
        if(openedPoints[i] != element) {
            newOpen.push(openedPoints[i]);
        }
    }
    return newOpen;
}

function isUnclosedNeighbour(neighbour, closedPoints) {
    for (let i = 0; i < closedPoints.length; i++) {
        if(closedPoints[i] == neighbour) {
            return false;
        }
    }
    return true;
}

function findAllUnclosedNeighbours(current, matrix, numberOfRows, numberOfColumns, closedPoints) {
    let unclosedNeighbours = [];
    for (let i = 0; i < numberOfRows * numberOfColumns; i++) {
        if(matrix[current][i] && isUnclosedNeighbour(i, closedPoints)) {
            unclosedNeighbours.push(i);
        }
    }
    return unclosedNeighbours;
}

function isNeighbourInOpen(neighbour, openedPoints) {
    for (let i = 0; i < openedPoints.length; i++) {
        if(openedPoints[i] == neighbour) {
            return true;
        }
    }
    return false;
}

function buildPath(startPoint, endPoint, previousPoint, numberOfRows, numberOfColumns) {
    path = [];
    for (let i = endPoint.secondValue * numberOfColumns + endPoint.firstValue; i != startPoint.secondValue * numberOfColumns + startPoint.firstValue; i = previousPoint[i]) {
        path.push(i)
    }
    path.push(startPoint.secondValue * numberOfColumns + startPoint.firstValue);
    path.reverse();
}

function isInPath(element, path) {
    for (let i = 0; i < path.length; i++) {
        if(element == path[i]) {
            return true;
        }
    }
    return false;
}

function printPath(path, allCells, allVisitedCells, potentialCells) {
    let current = 0;
    /*
    for (let i = 0; i < allVisitedCells.length; i++) {
        allCells[allVisitedCells[i]].style.backgroundColor = "rgb(255,205,249)";
    }
    */
    function go() {
        for (let i = 0; i < allCells.length; i++) {
            if(allCells[i].style.backgroundColor == "black") {
                allCells[i].style.backgroundColor = "white";
            }
        }
        for(let i = 0; i < potentialCells[current].length; i++) {
            allCells[potentialCells[current][i]].style.backgroundColor = "black";
        }
        //allCells[allVisitedCells[current]].style.backgroundColor = "rgb(0,0,0)";
        /*
        if(path[current] != allVisitedCells[current]) {
            let newCurrent = current;
            while (allVisitedCells[newCurrent] != path[current]) {
                allCells[allVisitedCells[newCurrent]].style.backgroundColor = "#52FA37FF";
                newCurrent++;
            }
        }
        allCells[path[current]].style.backgroundColor = "rgb(255, 100, 238)";

         */
        if(current >= 1) {
            if(isInPath(allVisitedCells[current - 1], path)) {
                allCells[allVisitedCells[current - 1]].style.backgroundColor = "rgb(255, 100, 238)";
            }
            else {
                allCells[allVisitedCells[current - 1]].style.backgroundColor = "rgb(123,0,255)";
            }
        }
        if(current == allVisitedCells.length - 1) {
            allCells[allVisitedCells[current]].style.backgroundColor = "rgb(255, 100, 238)";
            clearInterval(timerId);
        }
        current++;
    }
    go();
    let timerId = setInterval(go, 50);
}

let generatedMaze = false, maze;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function isVisitedCell(currentCell, visited) {
    for(let i = 0; i < visited.length; i++) {
        if(visited[i] == currentCell) {
            return true;
        }
    }
    return false;
}

function hasUnvisitedNeighbours(currentCell, cells, columnsNumber, visited) {
    let X = currentCell % columnsNumber;
    let Y = Math.floor(currentCell / columnsNumber);
    if(X - 2 >= 0 && !isVisitedCell(currentCell - 2, visited)) {
        return true;
    }
    if(X + 2 < columnsNumber && !isVisitedCell(currentCell + 2, visited)) {
        return true;
    }
    if(Y - 2 >= 0 && !isVisitedCell(currentCell - 2 * columnsNumber, visited)) {
        return true;
    }
    if(Y + 2 < columnsNumber && !isVisitedCell(currentCell + 2 * columnsNumber, visited)) {
        return true;
    }
    return false;
}

function randomCellNeighbour(currentCell, cells, columnsNumber, visited) {
    let X = currentCell % columnsNumber;
    let Y = Math.floor(currentCell / columnsNumber);
    let unvisitedNeighbours = [];
    if(X - 2 >= 0 && !isVisitedCell(currentCell - 2, visited)) {
        unvisitedNeighbours.push("left");
    }
    if(X + 2 < columnsNumber && !isVisitedCell(currentCell + 2, visited)) {
        unvisitedNeighbours.push("right");
    }
    if(Y - 2 >= 0 && !isVisitedCell(currentCell - 2 * columnsNumber, visited)) {
        unvisitedNeighbours.push("top");
    }
    if(Y + 2 < columnsNumber && !isVisitedCell(currentCell + 2 * columnsNumber, visited)) {
        unvisitedNeighbours.push("bottom");
    }
    let randomNumber = getRandomInt(0, unvisitedNeighbours.length);
    return unvisitedNeighbours[randomNumber];
}

generateMaze.onclick = function() {
    generatedMaze = true;
    let columnsNumber = counterColumns;
    maze = new Array(columnsNumber);
    for (let i = 0; i < columnsNumber; i++) {
        maze[i] = new Array(columnsNumber);
    }
    let cells = document.getElementsByClassName("cell");
    let unvisitedCells = -1;
    for(let i = 0; i < columnsNumber; i++) {
        for(let j = 0; j < columnsNumber; j++) {
            if(i % 2 == 0 && j % 2 == 0) {
                unvisitedCells++;
                maze[i][j] = 1;
                cells[i * columnsNumber + j].style.backgroundColor = "white";
            }
            else {
                maze[i][j] = 0;
                cells[i * columnsNumber + j].style.backgroundColor = "rgb(119, 119, 119)";
            }
        }
    }
    let startCell = 0;
    let currentCell = startCell;
    let visited = [];
    visited.push(currentCell);
    let stack = [];
    while (unvisitedCells != 0) {
        let X = currentCell % columnsNumber;
        let Y = Math.floor(currentCell / columnsNumber);
        if(hasUnvisitedNeighbours(currentCell, cells, columnsNumber, visited)) {
            stack.push(currentCell);
            let randomNeighbour = randomCellNeighbour(currentCell, cells, columnsNumber, visited);
            if(randomNeighbour == "right") {
                cells[currentCell + 1].style.backgroundColor = "white";
                maze[Y][X + 1] = 1;
                currentCell += 2;
            }
            else if(randomNeighbour == "left") {
                cells[currentCell - 1].style.backgroundColor = "white";
                maze[Y][X - 1] = 1;
                currentCell -= 2;
            }
            else if(randomNeighbour == "top") {
                cells[currentCell - columnsNumber].style.backgroundColor = "white";
                maze[Y - 1][X] = 1;
                currentCell -= 2 * columnsNumber;
            }
            else if(randomNeighbour == "bottom") {
                cells[currentCell + columnsNumber].style.backgroundColor = "white";
                maze[Y + 1][X] = 1;
                currentCell += 2 * columnsNumber;
            }
            visited.push(currentCell);
            unvisitedCells--;
        }
        else if(stack.length > 0) {
            currentCell = stack.pop();
        }
        else {
            let unvisited = [];
            for(let j = 0; j < cells.length; j++) {
                if(cells[j].visited == false) {
                    unvisited.push(j);
                }
            }
            let randomNumber = getRandomInt(0, unvisited.length);
            currentCell = unvisited[randomNumber];
            visited.push(currentCell);
            unvisitedCells--;
        }
    }
}

startAlgorithm.onclick = function() {
    let numberOfRows = counterColumns;
    if(numberOfRows > 131) {
        alert("Слишком большой лабиринт, введите данные поменьше");
        return;
    }
    let numberOfColumns = counterColumns;
    let matrix = new Array(numberOfRows * numberOfColumns);
    for (let i = 0; i < numberOfRows * numberOfColumns; i++) {
        matrix[i] = new Array(numberOfRows * numberOfColumns);
    }
    let adjacencyMatrix = new Array(numberOfRows);
    for (let i = 0; i < numberOfRows; i++) {
        adjacencyMatrix[i] = new Array(numberOfRows);
    }
    if (generatedMaze) {
        for(let i = 0; i < numberOfRows; i++) {
            for(let j = 0; j < numberOfRows; j++) {
                adjacencyMatrix[i][j] = maze[i][j];
            }
        }
    }
    let startFound = false;
    let finishFound = false;
    let allCells = document.getElementsByClassName("cell");
    for (let i = 0; i < allCells.length; i++) {
        if (allCells[i].style.backgroundColor == "rgb(255, 100, 238)") { // старт
            if (startFound) {
                alert("Вы выбрали более одного старта");
                return;
                //window.location.reload();
            } else {
                startFound = true;
                let startX = i % numberOfColumns;
                let startY = Math.floor(i / numberOfColumns);
                startPoint = new Point(startX, startY);
                adjacencyMatrix[Math.floor(i / numberOfColumns)][i % numberOfColumns] = 1;
            }
        }
        else if (allCells[i].style.backgroundColor == "rgb(111, 146, 255)") { // финиш
            if (finishFound) {
                alert("Вы выбрали более одного финиша");
                return;
                //window.location.reload();
            }
            else {
                finishFound = true;
                adjacencyMatrix[Math.floor(i / numberOfColumns)][i % numberOfColumns] = 1;
                let finishX = i % numberOfColumns;
                let finishY = Math.floor(i / numberOfColumns);
                endPoint = new Point(finishX, finishY);
            }
        }
        else if (allCells[i].style.backgroundColor == "" || allCells[i].style.backgroundColor == "white") {
            adjacencyMatrix[Math.floor(i / numberOfColumns)][i % numberOfColumns] = 1;
        }
        else if (allCells[i].style.backgroundColor == "rgb(119, 119, 119)") { // стена
            adjacencyMatrix[Math.floor(i / numberOfColumns)][i % numberOfColumns] = 0;
        }
    }
    if (!startFound) {
        alert("Вы не выбрали точку старта");
        return;
        //window.location.reload();
    }
    if (!finishFound) {
        alert("Вы не выбрали точку финиша");
        return;
        //window.location.reload();
    }
    generateNewMatrix(adjacencyMatrix, matrix, numberOfRows, numberOfColumns);
    let closedPoints = [];
    let openedPoints = [startPoint.secondValue * numberOfColumns + startPoint.firstValue];
    let previousPoint = new Array(numberOfRows * numberOfColumns);
    for (let i = 0; i < numberOfRows * numberOfColumns; i++) {
        previousPoint[i] = 0;
    }

    let realCost = new Array(numberOfRows * numberOfColumns);
    let heuristicCost = new Array(numberOfRows * numberOfColumns);
    realCost[startPoint.secondValue * numberOfColumns + startPoint.firstValue] = 0;
    heuristicCost[startPoint.secondValue * numberOfColumns + startPoint.firstValue] = realCost[startPoint.secondValue * numberOfColumns + startPoint.firstValue] + heuristicFunction(startPoint, endPoint);
    let potentialCells = [];
    let flag = "Failure";
    let allVisitedCells = [];
    while (openedPoints.length != 0) {
        let current = minHeuristicCost(openedPoints, heuristicCost);
        potentialCells.push(openedPoints);
        allVisitedCells.push(current);
        //allCells[current].style.backgroundColor = "black";
        if (current == endPoint.secondValue * numberOfColumns + endPoint.firstValue) {
            flag = "Success";
            break;
        }
        openedPoints = removeFromOpen(current, openedPoints);
        closedPoints.push(current);
        let unclosedNeighbours = findAllUnclosedNeighbours(current, matrix, numberOfRows, numberOfColumns, closedPoints);
        for (let i = 0; i < unclosedNeighbours.length; i++) {
            let temp_G = realCost[current] + 1;
            if (!isNeighbourInOpen(unclosedNeighbours[i], openedPoints) || (temp_G < realCost[unclosedNeighbours[i]])) {
                previousPoint[unclosedNeighbours[i]] = current;
                realCost[unclosedNeighbours[i]] = temp_G;
                let currentNeighbour = new Point(unclosedNeighbours[i] % numberOfColumns, Math.floor(unclosedNeighbours[i] / numberOfColumns))
                heuristicCost[unclosedNeighbours[i]] = realCost[unclosedNeighbours[i]] + heuristicFunction(currentNeighbour, endPoint);
            }
            if (!isNeighbourInOpen(unclosedNeighbours[i], openedPoints)) {
                openedPoints.push(unclosedNeighbours[i]);
            }
        }
    }
    if (flag == "Success") {
        buildPath(startPoint, endPoint, previousPoint, numberOfRows, numberOfColumns);
        printPath(path, allCells, allVisitedCells, potentialCells);
    } else {
        alert("Невозможно найти путь");
    }
}