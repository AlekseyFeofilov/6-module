import {ReLUFunction, ReLUFunctionDerivative} from "../Math/ActivationFunction.js";

export const dataNetwork = {
    layerCount: 3,
    bunchSize: 100,
    epochCount: 30,
    layerSize: [784, 256, 10],
    activationFunction: ReLUFunction,
    activationFunctionDerivative: ReLUFunctionDerivative,
}