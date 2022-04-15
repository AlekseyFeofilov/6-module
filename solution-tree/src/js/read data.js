let infoStrings = [];

getLearningInformation.onclick = function() {
    infoStrings = [];
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
}

let infoUser = [];

getUserInformation.onclick = function() {
    let userInfo = learningInformation.value;
    if(userInfo == "") {
        return;
    }
    if (userInfo.indexOf('\n') != -1) {
        alert("Введите только одну строку");
    }
    else {
        learningInformation.value = "";
        infoUser = userInfo.split(", ");
    }
    if(infoUser.length == 0) {
        infoUser = [];
    }
}