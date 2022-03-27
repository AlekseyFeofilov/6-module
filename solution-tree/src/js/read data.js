let infoStrings = [];
getLearningInformation.onclick = function() {
    let learningText = learningInformation.value;
    learningInformation.value = "";
    let currentRules = "";
    for (let i = 0; i < learningText.length; i++) {
        if(learningText[i] == "\n") {
            infoStrings.push(currentRules.split(","));
            currentRules = "";
        }
        else {
            if(learningText[i] != " ") {
                currentRules += learningText[i];
            }
        }
        if(i == learningText.length - 1) {
            infoStrings.push(currentRules.split(","));
            currentRules = "";
        }
    }
    alert(infoStrings);
}

/*
Yes, Yes, 83, No
Yes, No, 7, No
No, Yes, 50, Yes
No, Yes, 35, Yes
Yes, Yes, 38, Yes
Yes, No, 18, No
No, No, 12, No
 */
infoStrings = [
    ['Yes', 'Yes', 83, 'No'],
    ['Yes', 'No', 7, 'No'],
    ['No', 'Yes', 50, 'Yes'],
    ['No', 'Yes', 35, 'Yes'],
    ['Yes', 'Yes', 38, 'Yes'],
    ['Yes', 'No', 18, 'No'],
    ['No', 'No', 12, 'No']
]

let rightAnswer = infoStrings[0][infoStrings[0].length - 1];
let wrongAnswer;

for(let i = 0; i < infoStrings.length; i++) {
    if(infoStrings[i][infoStrings[i].length - 1] != rightAnswer) {
        wrongAnswer = infoStrings[i][infoStrings[i].length - 1];
        break;
    }
}

getUserInformation.onclick = function() {
    let userInfo = learningInformation.value;
    if (userInfo.indexOf('\n') != -1) {
        alert("Введите только одну строку");
    }
    else {
        learningInformation.value = "";
    }
}

class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
        this.success = null;
    }
}

class Tree {
    constructor() {
        this.root = null;
    }
}

function GiniForLeaf(conditionYes, conditionNo) {
    return 1 - Math.pow((conditionYes / (conditionYes + conditionNo)), 2) - Math.pow((conditionNo / (conditionYes + conditionNo)), 2);
}

function Gini(trueYes, trueNo, falseYes, falseNo) {
    let GiniForTrue = GiniForLeaf(trueYes, trueNo);
    let GiniForFalse = GiniForLeaf(falseYes, falseNo);
    return ((trueYes + trueNo) / (trueYes + trueNo + falseYes + falseNo)) * GiniForTrue + ((falseYes + falseNo) / (trueYes + trueNo + falseYes + falseNo)) * GiniForFalse;
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

let classificationTree = new Tree();

function setRoot(infoStrings, currentNode) {
    let trueCondition = new Array(infoStrings[0].length - 1);
    let falseCondition = new Array(infoStrings[0].length - 1);
    let impurityValues = new Array(infoStrings[0].length - 1);
    for(let i = 0; i < infoStrings[0].length - 1; i++) {
        trueCondition[i] = new Array(2);
        falseCondition[i] = new Array(2);
        trueCondition[i][0] = 0;
        trueCondition[i][1] = 0;
        falseCondition[i][0] = 0;
        falseCondition[i][1] = 0;
    }
    for(let i = 0; i < infoStrings[0].length - 1; i++) {
        if(isNaN(Number(infoStrings[0][i]))) {
            let trueValue = infoStrings[0][i];
            for(let j = 0; j < infoStrings.length; j++) {
                if(infoStrings[j][i] == trueValue) {
                    if(infoStrings[j][infoStrings[j].length - 1] == rightAnswer) {
                        trueCondition[i][0]++;
                    }
                    else {
                        trueCondition[i][1]++;
                    }
                }
                else {
                    if(infoStrings[j][infoStrings[j].length - 1] == rightAnswer) {
                        falseCondition[i][0]++;
                    }
                    else {
                        falseCondition[i][1]++;
                    }
                }
            }
            let GiniImpurity = Gini(trueCondition[i][0], trueCondition[i][1], falseCondition[i][0], falseCondition[i][1]);
            impurityValues[i] = GiniImpurity;
        }
        else {
            let array = [];
            let indexes = [];
            for(let j = 0; j < infoStrings.length; j++) {
                array[j] = infoStrings[j][i];
                indexes[j] = j;
            }
            //return;
            quickSort(0, array.length - 1, array, indexes);
            let average = [];
            for(let j = 0; j < indexes.length - 1; j++) {
                let avg = (array[indexes[j]] + array[indexes[j + 1]]) / 2;
                average.push(avg);
            }
            let trueConditionForNumbers = new Array(average.length);
            let falseConditionForNumbers = new Array(average.length);
            let numbersImpurity = new Array(average.length);
            for(let j = 0; j < average.length; j++) {
                trueConditionForNumbers[j] = new Array(2);
                falseConditionForNumbers[j] = new Array(2);
                trueConditionForNumbers[j][0] = 0;
                trueConditionForNumbers[j][1] = 0;
                falseConditionForNumbers[j][0] = 0;
                falseConditionForNumbers[j][1] = 0;
            }
            for(let j = 0; j < average.length; j++) {
                for(let k = 0; k < infoStrings.length; k++) {
                    if(infoStrings[k][i] < average[j]) {
                        if(infoStrings[k][infoStrings[0].length - 1] == rightAnswer) {
                            trueConditionForNumbers[j][0]++;
                        }
                        else {
                            trueConditionForNumbers[j][1]++;
                        }
                    }
                    else {
                        if(infoStrings[k][infoStrings[0].length - 1] == rightAnswer) {
                            falseConditionForNumbers[j][0]++;
                        }
                        else {
                            falseConditionForNumbers[j][1]++;
                        }
                    }
                }
                let currentImpurity = Gini(trueConditionForNumbers[j][0], trueConditionForNumbers[j][1], falseConditionForNumbers[j][0], falseConditionForNumbers[j][1]);
                numbersImpurity[j] = currentImpurity;
            }
            let minimImpurity = Infinity;
            let minElement;
            for(let j = 0; j < numbersImpurity.length; j++) {
                if(numbersImpurity[j] < minimImpurity) {
                    minimImpurity = numbersImpurity[j];
                    minElement = j;
                }
            }
            impurityValues[i] = minimImpurity;
            trueCondition[i][0] = trueConditionForNumbers[minElement][0];
            trueCondition[i][1] = trueConditionForNumbers[minElement][1];
            falseCondition[i][0] = falseConditionForNumbers[minElement][0];
            falseCondition[i][1] = falseConditionForNumbers[minElement][1];
        }
    }
    let minValue = impurityValues[0];
    let index = 0;
    for(let i = 1; i < impurityValues.length; i++) {
        if(impurityValues[i] < minValue) {
            minValue = impurityValues;
            index = i;
        }
    }
    currentNode = new Node(index);
    if(GiniForLeaf(trueCondition[index][0], trueCondition[index][1]) != 0) {
        let newInfoStrings = [];
        for(let i = 0; i < infoStrings.length; i++) {
            if(infoStrings[i][index] == infoStrings[0][index]) {
                newInfoStrings.push(infoStrings[i]);
            }
        }
        currentNode.left = setRoot(newInfoStrings);
    }
    else {
        currentNode.left = new Node(0);
        if(trueCondition[index][0] > trueCondition[index][1]) {
            currentNode.left.success = rightAnswer;
        }
        else {
            currentNode.left.success = wrongAnswer;
        }
    }
    if(GiniForLeaf(falseCondition[index][0], falseCondition[index][1]) != 0) {
        let newInfoStrings = [];
        for(let i = 0; i < infoStrings.length; i++) {
            if(infoStrings[i][index] != infoStrings[0][index]) {
                newInfoStrings.push(infoStrings[i]);
            }
        }
        currentNode.right = setRoot(newInfoStrings);
    }
    else {
        currentNode.right = new Node(0);
        if(falseCondition[index][0] > falseCondition[index][1]) {
            currentNode.right.success = rightAnswer;
        }
        else {
            currentNode.right.success = wrongAnswer;
        }
    }
    return currentNode;
}
classificationTree.root = setRoot(infoStrings);
alert(classificationTree.root.data);