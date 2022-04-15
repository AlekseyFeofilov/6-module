export {sigmaFunction, sigmaFunctionDerivative, ReLUFunctionDerivative, ReLUFunction}

function sigmaFunction(domain){
    return 1 / (1 + Math.exp(-domain));
}

function sigmaFunctionDerivative(value, domain = true){
    if(domain){
        value = sigmaFunction(value)
    }

    return value * (1 - value);
}

function ReLUFunction(value){
    if (value < 0){
        return 0.01 * value;
    }

    if(value > 1){
        return 1 + 0.01 * value;
    }

    return value
}

function ReLUFunctionDerivative(value, b) {
    if(value < 0 || value > 1){
        return 0.01;
    }

    return 1;
}
