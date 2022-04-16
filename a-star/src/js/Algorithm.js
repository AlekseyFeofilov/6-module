class Cell {
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
            if(diagonalHeuristic) {
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
            }
        }
    }
}

// Функция эвристики между двумя вершинами, основанная на теореме Пифагора
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
    function go() {
        for (let i = 0; i < allCells.length; i++) {
            if(allCells[i].style.backgroundColor == "black") {
                allCells[i].style.backgroundColor = "white";
            }
        }
        for(let i = 0; i < potentialCells[current].length; i++) {
            allCells[potentialCells[current][i]].style.backgroundColor = "black";
        }
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

    // Заполняем матрицу смежности на основе данных, введенных пользователем
    for (let i = 0; i < allCells.length; i++) {
        if (allCells[i].style.backgroundColor == "rgb(255, 100, 238)") { // старт
            if (startFound) {
                alert("Вы выбрали более одного старта");
                return;
            } else {
                startFound = true;
                let startX = i % numberOfColumns;
                let startY = Math.floor(i / numberOfColumns);
                startPoint = new Cell(startX, startY);
                adjacencyMatrix[Math.floor(i / numberOfColumns)][i % numberOfColumns] = 1;
            }
        }
        else if (allCells[i].style.backgroundColor == "rgb(111, 146, 255)") { // финиш
            if (finishFound) {
                alert("Вы выбрали более одного финиша");
                return;
            }
            else {
                finishFound = true;
                adjacencyMatrix[Math.floor(i / numberOfColumns)][i % numberOfColumns] = 1;
                let finishX = i % numberOfColumns;
                let finishY = Math.floor(i / numberOfColumns);
                endPoint = new Cell(finishX, finishY);
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
    }
    if (!finishFound) {
        alert("Вы не выбрали точку финиша");
        return;
    }

    generateNewMatrix(adjacencyMatrix, matrix, numberOfRows, numberOfColumns);

    let closedPoints = []; // Список вершин, которые уже просмотрены
    let openedPoints = [startPoint.secondValue * numberOfColumns + startPoint.firstValue]; // Список вершин, которые необходимо просмотреть
    let previousPoint = new Array(numberOfRows * numberOfColumns); // Массив, который нужен для последующего восстановления пути
    for (let i = 0; i < numberOfRows * numberOfColumns; i++) {
        previousPoint[i] = 0;
    }

    let realCost = new Array(numberOfRows * numberOfColumns); // Хранит информацию: сколько энергии понадобилось, чтобы добраться до какого-то узла
    let heuristicCost = new Array(numberOfRows * numberOfColumns); // Хранит информацию: предсказание: сколько энергии понадобится, чтобы добраться до конца, используя какой-то узел

    realCost[startPoint.secondValue * numberOfColumns + startPoint.firstValue] = 0;
    heuristicCost[startPoint.secondValue * numberOfColumns + startPoint.firstValue] = realCost[startPoint.secondValue * numberOfColumns + startPoint.firstValue] + heuristicFunction(startPoint, endPoint);
    let potentialCells = []; // Тут будут храниться клетки, которые рассматриваются на каждой итерации алгоритма (для визуализации)
    let pathIsFound = "Failure"; // Изначально предполагаем, что путь не найден
    let allVisitedCells = [];

    while (openedPoints.length != 0) {

        let current = minHeuristicCost(openedPoints, heuristicCost);
        potentialCells.push(openedPoints);
        allVisitedCells.push(current);
        if (current == endPoint.secondValue * numberOfColumns + endPoint.firstValue) { // Условие того, что путь найден
            pathIsFound = "Success";
            break;
        }
        
        openedPoints = removeFromOpen(current, openedPoints);
        closedPoints.push(current); // Он уже проверен, поэтому добавляем в проверенные вершины
        
        let unclosedNeighbours = findAllUnclosedNeighbours(current, matrix, numberOfRows, numberOfColumns, closedPoints);
        for (let i = 0; i < unclosedNeighbours.length; i++) {
            let tempRealCost = realCost[current] + 1; // Дистанция от current до нашего узла + дистанция от нашего узла до соседа
            if (!isNeighbourInOpen(unclosedNeighbours[i], openedPoints) || (tempRealCost < realCost[unclosedNeighbours[i]])) { // Условие того, что в соседа можно попасть из нашего узла по кратчайшему маршруту
                previousPoint[unclosedNeighbours[i]] = current;
                realCost[unclosedNeighbours[i]] = tempRealCost;
                let currentNeighbour = new Cell(unclosedNeighbours[i] % numberOfColumns, Math.floor(unclosedNeighbours[i] / numberOfColumns))
                heuristicCost[unclosedNeighbours[i]] = realCost[unclosedNeighbours[i]] + heuristicFunction(currentNeighbour, endPoint);
            }
            if (!isNeighbourInOpen(unclosedNeighbours[i], openedPoints)) {
                openedPoints.push(unclosedNeighbours[i]);
            }
        }
    }
    if (pathIsFound == "Success") {
        buildPath(startPoint, endPoint, previousPoint, numberOfRows, numberOfColumns);
        printPath(path, allCells, allVisitedCells, potentialCells);
    } else {
        alert("Невозможно найти путь");
    }
}