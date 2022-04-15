let optimizedTree = new Tree();
let optimizedNodesDividedByLayers = [];

function getPercentage(currentNode) {
    let outcomesNumber = 0;
    for(let i = 0; i < currentNode.outcomes.length; i++) {
        outcomesNumber += currentNode.outcomes[i];
    }
    let sum = 0;
    for(let i = 0; i < currentNode.outcomes.length; i++) {
        sum += Math.pow(currentNode.outcomes[i] / outcomesNumber, 2);
    }
    return sum;
}

function getCorrectness(currentNode) { // только для нелистовых вершин

    let outcomesNumber = 0;
    for(let i = 0; i < currentNode.outcomes.length; i++) {
        outcomesNumber += currentNode.outcomes[i];
    }
    for(let i = 0; i < currentNode.children.length; i++) {
        let sum = 0;
        for (let j = 0; j < currentNode.children[i].outcomes.length; j++) {
            sum += currentNode.children[i].outcomes[j];
        }
        currentNode.children[i].proportion = sum / outcomesNumber;
        currentNode.children[i].percentageOfCorrectGuessing = getPercentage(currentNode.children[i], sum);
    }

    // Если это корень дерева
    if(currentNode.parent == null) {
        currentNode.correctnessBeforePruning = getPercentage(currentNode);
        let correctnessValue = 0;
        for(let i = 0; i < currentNode.children.length; i++) {
            correctnessValue += currentNode.children[i].proportion * currentNode.children[i].percentageOfCorrectGuessing;
        }
        currentNode.correctnessAfterPruning = correctnessValue;
    }
    else {
        currentNode.correctnessBeforePruning = currentNode.parent.correctnessAfterPruning;
        let correctnessValue = 0;
        for(let i = 0; i < currentNode.parent.children.length; i++) {
            if(currentNode.parent.children[i] != currentNode) {
                correctnessValue += currentNode.parent.children[i].proportion * currentNode.parent.children[i].percentageOfCorrectGuessing;
            }
        }
        for(let i = 0; i < currentNode.children.length; i++) {
            let numberOfChildrenOutcomes = 0;
            for(let j = 0; j < currentNode.children[i].outcomes.length; j++) {
                numberOfChildrenOutcomes += currentNode.children[i].outcomes[j];
            }
            correctnessValue += currentNode.proportion * (numberOfChildrenOutcomes / outcomesNumber) * currentNode.children[i].percentageOfCorrectGuessing;
        }
        currentNode.correctnessAfterPruning = correctnessValue;
    }

}

function cutBranches(currentVertex) {
    if(currentVertex.data != 0) {
        for (let i = 0; i < currentVertex.children.length; i++) {
            if(currentVertex.children[i].data != 0) {
                console.log(currentVertex.children[i].correctnessAfterPruning - currentVertex.children[i].correctnessBeforePruning);
                if(currentVertex.children[i].correctnessAfterPruning - currentVertex.children[i].correctnessBeforePruning < 0.02) { // то надо отсечь эту ветвь
                    let maxResult = -1;
                    for(let j = 0; j < currentVertex.children[i].outcomes.length; j++) {
                        if(currentVertex.children[i].outcomes[j] > maxResult) {
                            currentVertex.children[i].success = currentVertex.children[i].outcomesValues[j];
                            maxResult = currentVertex.children[i].outcomes[j];
                        }
                    }
                    // Превращаем в лист
                    currentVertex.children[i].data = 0;
                    currentVertex.children[i].children = null;
                    currentVertex.children[i].length = String(currentVertex.children[i].success).length;
                    currentVertex.children[i].width = currentVertex.children[i].length * pt;
                }
                else {
                    cutBranches(currentVertex.children[i]);
                }
            }
        }
    }
}

function pruneTree() {

    for(let i = 0; i < nodesDividedByLayers.length; i++) {
        for(let j = 0; j < nodesDividedByLayers[i].length; j++) {
            if(nodesDividedByLayers[i][j].data != 0) {
                getCorrectness(nodesDividedByLayers[i][j]);
            }
        }
    }
    optimizedTree.root = classificationTree.root;
    cutBranches(optimizedTree.root);
}

function divideNodesByLayers(currentNode, currentLayer) {
    if(optimizedNodesDividedByLayers[currentLayer] == null) {
        optimizedNodesDividedByLayers[currentLayer] = [];
    }
    optimizedNodesDividedByLayers[currentLayer].push(currentNode);
    if(currentNode.children != null) {
        for(let i = 0; i < currentNode.children.length; i++) {
            divideNodesByLayers(currentNode.children[i], currentLayer + 1);
        }
    }
}

optimizeTree.onclick = function() {

    if(classificationTree.root === null) {
        alert("Сначала постройте обычное дерево");
        return;
    }
    optimizedNodesDividedByLayers = [];
    optimizedTree.root = classificationTree.root;
    pruneTree(optimizedTree.root);
    if(optimizedTree == classificationTree) {
        alert("Дерево уже оптимизировано");
        return;
    }
    divideNodesByLayers(optimizedTree.root, 0);
    drawTree(optimizedTree, optimizedNodesDividedByLayers);
}