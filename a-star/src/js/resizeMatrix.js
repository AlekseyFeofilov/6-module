let table = document.getElementById("tab");

let counterColumns = 2;
let counterRows = 2;

plusButtonColumns.onclick = function() {
    counterRows++;
    if(counterRows >= 132) {
        alert("Слишком большой лабиринт, введите данные поменьше");
        return;
    }
    let newRow = table.insertRow(-1);
    let columnsNumber = table.tBodies[0].rows[0].cells.length;
    for (let i = 0; i < columnsNumber; i++) {
        table.tBodies[0].rows[counterRows - 1].insertCell(i);
    }
    let inputTags = new Array(columnsNumber);
    for(let i = 0; i < columnsNumber; i++) {
        inputTags[i] = document.createElement('input');
        inputTags[i].setAttribute("type", "button");
        inputTags[i].setAttribute("value", "");
        inputTags[i].setAttribute("class", "cell");
        table.firstElementChild.children[table.firstElementChild.children.length - 1].children[i].appendChild(inputTags[i])
    }
    inputTags.length = 0;
    counterColumns++;
    let rows = table.tBodies[0].rows;
    for (let i = 0, l = rows.length; i < l; i++) {
        table.rows[i].insertCell(-1);
    }
    inputTags = new Array(rows.length);
    for(let i = 0; i < rows.length; i++) {
        inputTags[i] = document.createElement('input');
        inputTags[i].setAttribute("type", "button");
        inputTags[i].setAttribute("value", "");
        inputTags[i].setAttribute("class", "cell");
        table.firstElementChild.children[i].children[table.firstElementChild.children[i].children.length - 1].appendChild(inputTags[i]);
    }
    inputTags.length = 0;
}

minusButtonColumns.onclick = function() {
    if(counterColumns >= 2) {
        counterColumns--;
        let rows = table.tBodies[0].rows;
        for (let i = 0; i < rows.length; i++) {
            let currentCell = table.firstElementChild.children[i].children[table.firstElementChild.children[i].children.length - 1];
            currentCell.remove();
        }
    }
    if(counterRows >= 2) {
        counterRows--;
        table.firstElementChild.children[table.firstElementChild.children.length - 1].remove();
    }
}

sizeSubmit.onclick = function() {
    let numberOfColumns = sizeInput.value;
    if(numberOfColumns > 131) {
        alert("Слишком большой лабиринт, введите данные поменьше");
        return;
    }
    let numberOfRows = sizeInput.value;
    let result = numberOfColumns.match(/[1-9][0-9]*/);
    if(result != null) {
        if (result != numberOfColumns) {
            if (numberOfColumns.indexOf(" ") >= 0) {
                alert("Введите число без пробелов");
            } else {
                alert("Количество столбцов должно быть целым натуральным числом");
            }
        }
        else {
            numberOfColumns = Number(numberOfColumns);
            numberOfColumns -= counterColumns;
            if(numberOfColumns > 0) {
                let rows = table.tBodies[0].rows;
                let inputTags = new Array(rows.length * numberOfColumns);
                for(let i = 0; i < rows.length * numberOfColumns; i++) {
                    inputTags[i] = document.createElement('input');
                    inputTags[i].setAttribute("type", "button");
                    inputTags[i].setAttribute("value", "");
                    inputTags[i].setAttribute("class", "cell");
                }
                // добавлять столбцы
                for (let j = 0; j < numberOfColumns; j++) {
                    counterColumns++;
                    let rows = table.tBodies[0].rows;
                    for (let i = 0, l = rows.length; i < l; i++) {
                        table.rows[i].insertCell(-1);
                        table.firstElementChild.children[i].children[table.firstElementChild.children[i].children.length - 1].appendChild(inputTags[j * rows.length + i]);
                    }
                }
                inputTags.length = 0;
            }
            else if(numberOfColumns < 0) {
                numberOfColumns = Math.abs(numberOfColumns);
                for (let j = 0; j < numberOfColumns; j++) {
                    counterColumns--;
                    let rows = table.tBodies[0].rows;
                    for (let i = 0; i < rows.length; i++) {
                        let currentCell = table.firstElementChild.children[i].children[table.firstElementChild.children[i].children.length - 1];
                        currentCell.remove();
                    }
                }
            }

            numberOfRows = Number(numberOfRows);
            numberOfRows -= counterRows;
            // добавлять строки
            if(numberOfRows > 0) {
                let columnsNumber = table.tBodies[0].rows[0].cells.length;
                let inputTags = new Array(columnsNumber * numberOfRows);
                for(let i = 0; i < columnsNumber * numberOfRows; i++) {
                    inputTags[i] = document.createElement('input');
                    inputTags[i].setAttribute("type", "button");
                    inputTags[i].setAttribute("value", "");
                    inputTags[i].setAttribute("class", "cell");
                }
                for(let j = 0; j < numberOfRows; j++) {
                    counterRows++;
                    let newRow = table.insertRow(-1);
                    for (let i = 0; i < columnsNumber; i++) {
                        table.tBodies[0].rows[counterRows - 1].insertCell(i);
                    }
                    for (let i = 0; i < columnsNumber; i++) {
                        table.firstElementChild.children[table.firstElementChild.children.length - 1].children[i].appendChild(inputTags[j * columnsNumber + i]);
                    }

                }
                inputTags.length = 0;
            }
            // удалять строки
            else if(numberOfRows < 0) {
                numberOfRows = Math.abs(numberOfRows);
                for (let j = 0; j < numberOfRows; j++) {
                    counterRows--;
                    table.firstElementChild.children[table.firstElementChild.children.length - 1].remove();
                }
            }
        }
    }
    //rowsResize();
}

reloadButton.onclick = function() {
    location.reload ();
}