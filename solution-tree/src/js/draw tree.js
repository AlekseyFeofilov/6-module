let example = document.getElementById("canvas");
ctx = example.getContext('2d')
ctx.font = "15pt Comic Sans MS";

let pt = 10.279947916666666666666666666667;
let heightDifference = 250;

function drawLine(currentNode, fromX, fromY, toX, toY) {
    ctx.beginPath();
    //ctx.fillStyle()
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    if(toY - fromY > 0) {
        ctx.font = "bold 13pt Comic Sans MS";
        ctx.fillStyle = '#0059ff'
        ctx.fillText(currentNode.question, toX - currentNode.question.length * pt / 2 - 10, toY - 30);
        ctx.font = "15pt Comic Sans MS";
        ctx.fillStyle = '#000000';
    }
    else if(toY - fromY < 0) {
        ctx.font = "bold 13pt Comic Sans MS";
        ctx.fillStyle = '#0059ff'
        ctx.fillText(currentNode.question, toX - currentNode.question.length * pt / 2 - 10, toY + 30);
        ctx.font = "15pt Comic Sans MS";
        ctx.fillStyle = '#000000';
    }
    else {
        ctx.font = "bold 13pt Comic Sans MS";
        ctx.fillStyle = '#0059ff'
        ctx.fillText(currentNode.question, toX - currentNode.question.length * pt / 2 - 40, toY + 14);
        ctx.font = "15pt Comic Sans MS";
        ctx.fillStyle = '#000000';
    }
    ctx.closePath();
}

function drawLayer(startX, startY, currentLayer, currentStart) {

    let currentLevelNodesNumber = nodesDividedByLayers[currentLayer].length;
    let startPositionX = currentStart;
    let startPositionY;
    if(currentLevelNodesNumber % 2 == 1) {
        startPositionY = startY - heightDifference * (currentLevelNodesNumber - 1) / 2;
    }
    else {
        startPositionY = startY + heightDifference / 2 - heightDifference * (currentLevelNodesNumber) / 2;
    }

    for(let i = 0; i < currentLevelNodesNumber; i++) {
        if(nodesDividedByLayers[currentLayer][i].data != 0) {
            if(nodesDividedByLayers[currentLayer][i].numericValue != null) {
                ctx.fillText("Призн. " + nodesDividedByLayers[currentLayer][i].data + " < " + nodesDividedByLayers[currentLayer][i].numericValue, startPositionX, startPositionY + i * heightDifference);
            }
            else {
                ctx.fillText("Признак " + nodesDividedByLayers[currentLayer][i].data, startPositionX, startPositionY + i * heightDifference);
            }
            nodesDividedByLayers[currentLayer][i].positionX = startPositionX;
            nodesDividedByLayers[currentLayer][i].positionY = startPositionY + i * heightDifference;
        }
        else {
            ctx.fillStyle = '#ff0000';
            ctx.font = "bold 15pt Comic Sans MS";
            ctx.fillText(nodesDividedByLayers[currentLayer][i].success, startPositionX, startPositionY + i * heightDifference);
            ctx.font = "15pt Comic Sans MS";
            ctx.fillStyle = '#000000';
            nodesDividedByLayers[currentLayer][i].positionX = startPositionX;
            nodesDividedByLayers[currentLayer][i].positionY = startPositionY + i * heightDifference;
            ctx.strokeRect(nodesDividedByLayers[currentLayer][i].positionX - 2, nodesDividedByLayers[currentLayer][i].positionY - 22, nodesDividedByLayers[currentLayer][i].width + 10, 28);
        }
    }
}

function drawLines(currentNode) {

    if(currentNode.children != null) {
        for(let i = 0; i < currentNode.children.length; i++) {
            drawLine(currentNode.children[i], currentNode.positionX + currentNode.width + 5, currentNode.positionY - 6, currentNode.children[i].positionX - 5, currentNode.children[i].positionY - 6);
            drawLines(currentNode.children[i]);
        }
    }

}

function drawTree() {

    let maxHeight = -1;
    for(let i = 0; i < nodesDividedByLayers.length; i++) {
        if(nodesDividedByLayers[i].length > maxHeight) {
            maxHeight = nodesDividedByLayers[i].length;
        }
    }

    //console.log(maxHeight);
    let startX = 0;
    let startY = heightDifference * maxHeight / 2 + heightDifference;

    if(nodesDividedByLayers[0][0].data != 0) {
        if(nodesDividedByLayers.numericValue != null) {
            ctx.fillText("< " + nodesDividedByLayers[0][0].numericValue, startX, startY);
        }
        else {
            ctx.fillText("Признак " + nodesDividedByLayers[0][0].data, startX, startY);   
        }
        nodesDividedByLayers[0][0].positionX = startX;
        nodesDividedByLayers[0][0].positionY = startY;
    }
    startX += 400;
    for(let i = 1; i < nodesDividedByLayers.length; i++) {
        let maxWidth = -1;
        for(let j = 0; j < nodesDividedByLayers[i - 1].length; j++) {
            if(nodesDividedByLayers[i - 1][j].width > maxWidth) {
                maxWidth = nodesDividedByLayers[i - 1][j].width;
            }
        }
        startX += maxWidth + 400;
        drawLayer(0, startY, i, startX);
    }
    //console.log(classificationTree);
    drawLines(classificationTree.root);
}

let path = [];

function getResult(currentVertex, infoUser) {
    path.push(currentVertex);
    if(currentVertex.data == 0) {
        return currentVertex.success;
    }
    for(let i = 0; i < currentVertex.children.length; i++) {
        if(isNaN(Number(infoUser[currentVertex.data - 1]))) {
            if(currentVertex.children[i].question == infoUser[currentVertex.data - 1]) {
                return getResult(currentVertex.children[i], infoUser)
            }
        }
        else {
            if(currentVertex.numericValue > Number(infoUser[currentVertex.data - 1])) {
                return getResult(currentVertex.children[i], infoUser);
            }
            else {
                return getResult(currentVertex.children[i + 1], infoUser);
            }
        }
    }
}

function drawPath() {
    for(let i = 0; i < path.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(path[i].positionX + path[i].width + 5, path[i].positionY - 6);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#ff00e4";
        ctx.lineTo(path[i + 1].positionX - 5, path[i + 1].positionY - 6);
        ctx.stroke();
        ctx.closePath();
    }
}

getPath.onclick = function() {
    if(infoUser.length == 0) {
        alert("Введите исследуемый элемент");
        return;
    }
    else {
        path = [];
        getResult(classificationTree.root, infoUser);
        drawPath();
    }
}