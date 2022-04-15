let nodesDividedByLayers = [];

class Node {
    constructor(data, question) {
        this.data = data;
        this.parent = null;
        this.children = null;
        this.success = null;
        this.outcomes = [];
        this.outcomesValues = [];
        this.proportion = null;
        this.percentageOfCorrectGuessing = null;
        this.correctnessBeforePruning = null;
        this.correctnessAfterPruning = null;
        this.question = question;
        this.numericValue = null;
        this.positionX = null;
        this.positionY = null;
        this.length = null;
        this.width = null;
    }
}

class Tree {
    constructor() {
        this.root = null;
    }
}

let classificationTree = new Tree();

function Entropy(outcomes) {
    let elementsNumber = 0;
    for(let i = 0; i < outcomes.length; i++) {
        elementsNumber += outcomes[i];
    }
    let entropyValue = 0;
    for(let i = 0; i < outcomes.length; i++) {
        entropyValue += -(outcomes[i] / elementsNumber) * Math.log2(outcomes[i] / elementsNumber);
    }
    return entropyValue;
}

function quickSort(begin, end, array, indexes) {
    let i = begin;
    let j = end;
    let x = array[indexes[Math.floor((begin + end) / 2)]];
    while (i < j) {
        while (array[indexes[i]] < x) {
            i++;
        }
        while (array[indexes[j]] > x) {
            j--;
        }
        if(i <= j) {
            let t = indexes[j];
            indexes[j] = indexes[i];
            indexes[i] = t;
            i++;
            j--;
        }
    }
    if(i < end) {
        quickSort(i, end, array, indexes);
    }
    if(j > begin) {
        quickSort(begin, j, array, indexes);
    }
}

function getGainValue(mainEntropyValue, entropies, entropyInformation, outcomes) {

    let outcomesNumber = 0;
    for(let i = 0; i < outcomes.length; i++) {
        outcomesNumber += outcomes[i];
    }

    let attributeValuesNumber = new Array(entropyInformation.length);
    for(let i = 0; i < attributeValuesNumber.length; i++) {
        attributeValuesNumber[i] = 0;
    }

    for(let i = 0; i < entropyInformation.length; i++) {
        for(let j = 0; j < entropyInformation[i].length; j++) {
            attributeValuesNumber[i] += entropyInformation[i][j];
        }
    }

    let gainValue = mainEntropyValue;
    for(let i = 0; i < entropies.length; i++) {
        gainValue -= entropies[i] * (attributeValuesNumber[i] / outcomesNumber);
    }
    return gainValue;
}

function doCalculationsWithString(infoStrings, indexOfAttribute, mainEntropyValue, outcomes) {

    // Поиск уникальных атрибутов
    let valuesOfAttribute = [];
    for(let i = 0; i < infoStrings.length; i++) {
        if(valuesOfAttribute.indexOf(infoStrings[i][indexOfAttribute]) == -1) {
            valuesOfAttribute.push(infoStrings[i][indexOfAttribute]);
        }
    }

    let possibleOutcomes = [];
    for(let i = 0; i < infoStrings.length; i++) {
        if(possibleOutcomes.indexOf(infoStrings[i][infoStrings[i].length - 1]) == -1) {
            possibleOutcomes.push(infoStrings[i][infoStrings[i].length - 1]);
        }
    }

    // В этой матрице будет проводиться подсчет статистики для энтропии
    let entropyInformation = new Array(valuesOfAttribute.length);
    for(let i = 0; i < valuesOfAttribute.length; i++) {
        entropyInformation[i] = new Array(possibleOutcomes.length);
        for(let j = 0; j < possibleOutcomes.length; j++) {
            entropyInformation[i][j] = 0;
        }
    }

    // Подсчет статистики для энтропии
    for(let i = 0; i < valuesOfAttribute.length; i++) {
        for(let j = 0; j < infoStrings.length; j++) {
            if(infoStrings[j][indexOfAttribute] == valuesOfAttribute[i]) {
                // Ищем какой индекс исхода у этого элемента
                for(let k = 0; k < possibleOutcomes.length; k++) {
                    if(infoStrings[j][infoStrings[j].length - 1] == possibleOutcomes[k]) {
                        entropyInformation[i][k]++;
                        break;
                    }
                }
            }
        }
    }

    // Вычисление энтропии для каждого значения данного атрибута
    let entropies = [];
    for(let i = 0; i < entropyInformation.length; i++) {
        entropies.push(Entropy(entropyInformation[i]));
        if(isNaN(entropies[i])) {
            entropies[i] = 0;
        }
    }

    return getGainValue(mainEntropyValue, entropies, entropyInformation, outcomes);
}

function doCalculationsWithNumber(infoStrings, indexOfAttribute, mainEntropyValue, outcomes) {

    let indexes = [];
    let values = [];
    for(let i = 0; i < infoStrings.length; i++) {
        values.push(Number(infoStrings[i][indexOfAttribute]));
    }
    let uniqueSet = new Set(values);
    values = [...uniqueSet];
    for(let i = 0; i < values.length; i++) {
        indexes.push(i);
    }
    quickSort(0, values.length - 1, values, indexes);

    let average = [];
    for(let i = 0; i < indexes.length - 1; i++) {
        average.push((Number(values[indexes[i]]) + Number(values[indexes[i + 1]])) / 2);
    }

    let possibleOutcomes = [];
    for(let i = 0; i < infoStrings.length; i++) {
        if(possibleOutcomes.indexOf(infoStrings[i][infoStrings[i].length - 1]) == -1) {
            possibleOutcomes.push(infoStrings[i][infoStrings[i].length - 1]);
        }
    }

    // Разбиение данных на 2 группы и обработка данных для подсчета энтропии для каждой из групп
    let leftBranchEntropy = new Array(average.length);
    let rightBranchEntropy = new Array (average.length);

    for(let i = 0; i < average.length; i++) {
        leftBranchEntropy[i] = new Array(possibleOutcomes.length);
        rightBranchEntropy[i] = new Array(possibleOutcomes.length);
        for(let m = 0; m < possibleOutcomes.length; m++) {
            leftBranchEntropy[i][m] = 0;
            rightBranchEntropy[i][m] = 0;
        }
        for(let j = 0; j < infoStrings.length; j++) {
            if(Number(infoStrings[j][indexOfAttribute]) < average[i]) {
                for(let k = 0; k < possibleOutcomes.length; k++) {
                    if(infoStrings[j][infoStrings[j].length - 1] == possibleOutcomes[k]) {
                        leftBranchEntropy[i][k]++;
                        break;
                    }
                }
            }
            else {
                for(let k = 0; k < possibleOutcomes.length; k++) {
                    if(infoStrings[j][infoStrings[j].length - 1] == possibleOutcomes[k]) {
                        rightBranchEntropy[i][k]++;
                        break;
                    }
                }
            }
        }
    }

    // подсчет энтропии
    let entropies = new Array(average.length);
    for(let i = 0; i < average.length; i++) {
        entropies[i] = new Array(2);
        entropies[i][0] = Entropy(leftBranchEntropy[i]);
        entropies[i][1] = Entropy(rightBranchEntropy[i]);
        if(isNaN(entropies[i][0])) {
            entropies[i][0] = 0;
        }
        if(isNaN(entropies[i][1])) {
            entropies[i][1] = 0;
        }
    }

    let gainValues = new Array(average.length);
    for(let i = 0; i < average.length; i++) {
        let entropyInformation = new Array(2);
        entropyInformation[0] = [0];
        entropyInformation[1] = [0];
        for(let j = 0; j < possibleOutcomes.length; j++) {
            entropyInformation[0][0] += leftBranchEntropy[i][j];
            entropyInformation[1][0] += rightBranchEntropy[i][j];
        }
        gainValues[i] = getGainValue(mainEntropyValue, entropies[i], entropyInformation, outcomes);
    }

    let maxGainValue = -Infinity;
    let index = -1;
    let bestAverage;
    for(let i = 0; i < gainValues.length; i++) {
        if(gainValues[i] > maxGainValue) {
            maxGainValue = gainValues[i];
            index = i;
            bestAverage = average[i];
        }
    }

    return [maxGainValue, bestAverage];
}

function isInExceptions(currentNode, index) {
    let exceptions = [];
    while (currentNode.parent !== null) {
        if(currentNode.parent.data - 1 == index) {
            return true;
        }
        else {
            currentNode = currentNode.parent;
        }
    }
    if(exceptions.indexOf(index) == -1) {
        return false;
    }
    else {
        return true;
    }
}

function getExceptionsNumber(currentNode) {
    let counter = 0;
    while (currentNode.parent !== null) {
        counter++;
        currentNode = currentNode.parent;
    }
    return counter;
}

function buildTree(infoStrings, parentNode, layersNumber) {

    let currentNode = new Node();
    currentNode.parent = parentNode;

    if(nodesDividedByLayers[layersNumber] == null) {
        nodesDividedByLayers[layersNumber] = [];
    }

    // Смотрим, какие исходы на данном этапе есть. Эта информация понадобится при подсчете энтропии
    let outcomesValues = [];
    let outcomes = [];
    for(let i = 0; i < infoStrings.length; i++) {
        let indexOfOutcome = outcomesValues.indexOf(infoStrings[i][infoStrings[i].length - 1]);
        if(indexOfOutcome == -1) {
            outcomesValues.push(infoStrings[i][infoStrings[i].length - 1]);
            outcomes.push(1);
        }
        else {
            outcomes[indexOfOutcome]++;
        }
    }
    currentNode.outcomes = outcomes;
    currentNode.outcomesValues = outcomesValues;
    let entropyValue = Entropy(outcomes);
    if(entropyValue == 0 || infoStrings[0].length - 1 == getExceptionsNumber(currentNode)) { // Условие того, что перед нами лист
        if(entropyValue == 0) {
            currentNode.data = 0;
            currentNode.parent = parentNode;
            currentNode.success = outcomesValues[0];
            currentNode.length = String(currentNode.success).length;
            currentNode.width = currentNode.length * pt;
            nodesDividedByLayers[layersNumber].push(currentNode);
            return currentNode;
        }
        else {
            currentNode.data = 0;
            currentNode.parent = parentNode;
            let maxim = -1;
            let indexMax = -1;
            for(let i = 0; i < outcomes.length; i++) {
                if(outcomes[i] > maxim) {
                    maxim = outcomes[i];
                    indexMax = i;
                }
            }
            currentNode.success = outcomesValues[indexMax];
            currentNode.length = String(currentNode.success).length;
            currentNode.width = currentNode.length * pt;
            nodesDividedByLayers[layersNumber].push(currentNode);
            return currentNode;
        }
    }

    // Ищем максимальнй информационный прирост
    let maxGainValue = -Infinity;
    let index = -1;

    for(let i = 0; i < infoStrings[0].length - 1; i++) {
        if(!isInExceptions(currentNode, i)) {
            let currentAttributeGainValue;
            if(isNaN(Number(infoStrings[0][i]))) { // если атрибут - строка
                currentAttributeGainValue = doCalculationsWithString(infoStrings, i, entropyValue, outcomes);
                if(currentAttributeGainValue > maxGainValue) {
                    maxGainValue = currentAttributeGainValue;
                    index = i;
                }
            }
            else { // если атрибут - число
                currentAttributeGainValue = doCalculationsWithNumber(infoStrings, i, entropyValue, outcomes);
                if(currentAttributeGainValue[0] > maxGainValue) {
                    maxGainValue = currentAttributeGainValue[0];
                    index = i;
                    var bestAverage = currentAttributeGainValue[1];
                }
            }
        }
    }

    currentNode.data = index + 1;
    currentNode.parent = parentNode;
    currentNode.length = String(currentNode.data).length + 9;
    currentNode.width = currentNode.length * pt;

    // Если текущий вопрос связан с числом, то надо запомнить это число
    if(!isNaN(Number(infoStrings[0][index]))) {
        currentNode.numericValue = bestAverage;
        currentNode.length = String(currentNode.numericValue).length + 9 + String(currentNode.data).length;
        currentNode.width = currentNode.length * pt;
    }


    // Для строковых данных
    if(isNaN(Number(infoStrings[0][index]))) {
        let valuesOfAttribute = [];
        for(let i = 0; i < infoStrings.length; i++) {
            if(valuesOfAttribute.indexOf(infoStrings[i][index]) == -1) {
                valuesOfAttribute.push(infoStrings[i][index]);
            }
        }
        currentNode.children = new Array(valuesOfAttribute.length);
        for(let i = 0; i < valuesOfAttribute.length; i++) {
            let newInfoStrings = [];
            for(let j = 0; j < infoStrings.length; j++) {
                if(infoStrings[j][index] == valuesOfAttribute[i]) {
                    newInfoStrings.push(infoStrings[j]);
                }
            }
            currentNode.children[i] = buildTree(newInfoStrings, currentNode, layersNumber + 1, nodesDividedByLayers);
            currentNode.children[i].question = valuesOfAttribute[i];
            let maxQuantity = -1;
            let ind = -1;
            if(getExceptionsNumber(currentNode) == infoStrings[0].length - 1) {
                for(let j = 0; j < outcomes.length; j++) {
                    if(outcomes[j] > maxQuantity) {
                        maxQuantity = outcomes[j];
                        ind = j;
                    }
                }
                currentNode.children[i].success = outcomesValues[ind];
            }
        }
    }

    // Для численных данных
    else {
        currentNode.children = new Array(2);
        let newInfoStringsForLeft = [];
        let newInfoStringsForRight = [];
        for(let i = 0; i < infoStrings.length; i++) {
            if(infoStrings[i][index] < bestAverage) {
                newInfoStringsForLeft.push(infoStrings[i]);
            }
            else {
                newInfoStringsForRight.push(infoStrings[i]);
            }
        }
        currentNode.children[0] = buildTree(newInfoStringsForLeft, currentNode, layersNumber + 1, nodesDividedByLayers);
        currentNode.children[1] = buildTree(newInfoStringsForRight, currentNode, layersNumber + 1, nodesDividedByLayers);
        currentNode.children[0].question = "Да";
        currentNode.children[1].question = "Нет";
        let maxQuantity = -1;
        let ind = -1;
        if(getExceptionsNumber(currentNode) == infoStrings[0].length - 1) {
            for(let j = 0; j < outcomes.length; j++) {
                if(outcomes[j] > maxQuantity) {
                    maxQuantity = outcomes[j];
                    ind = j;
                }
            }
            currentNode.children[0].success = outcomesValues[ind];
            currentNode.children[1].success = outcomesValues[ind];
        }
    }

    nodesDividedByLayers[layersNumber].push(currentNode);
    return currentNode;
}

treeBuilding.onclick = function() {
    if(infoStrings.length == 0) {
        alert("Введите обучающую выборку");
        return;
    }
    else {
        nodesDividedByLayers = [];
        classificationTree.root = buildTree(infoStrings, null, 0);
        drawTree(classificationTree, nodesDividedByLayers);
    }
}