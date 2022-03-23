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