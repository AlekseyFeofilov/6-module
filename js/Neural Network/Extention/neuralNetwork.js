import {Matrix} from "../Math/Matrix.js";
import {Dependence} from "../Math/Enums.js";
import {dataNetwork} from "../Data/properties.js";

export {NeuralNetwork}

class NeuralNetwork {
    constructor() {
        this.propertiesInit();

        this.weightInit();
        this.biasInit();
        this.neuronInit();

        this.deltaInit();
        this.gradientInit();
    }

//////initialization////////
    propertiesInit() {
        this.layerCount = dataNetwork.layerCount;
        this.layerSize = dataNetwork.layerSize;
        this.bunchSize = dataNetwork.bunchSize;
        this.activationFunction = dataNetwork.activationFunction;
        this.activationFunctionDerivative = dataNetwork.activationFunctionDerivative;
        this.epochCount = dataNetwork.epochCount;
        this.bunchIndex = 0;
    }

    weightInit() {
        this.weight = new Array(this.layerCount - 1);

        for (let i = 0; i < this.weight.length; i++) {
            this.weight[i] = new Matrix(this.layerSize[i + 1], this.layerSize[i]);
            this.weight[i].fillMatrix(Dependence.WEIGHT);
        }
    }

    biasInit() {
        this.bias = new Array(this.layerCount - 1)

        for (let i = 0; i < this.bias.length; i++) {
            this.bias[i] = new Matrix(this.layerSize[i + 1], 1);
            this.bias[i].fillMatrix(Dependence.BIAS);
        }
    }

    neuronInit() {
        this.neuron = new Array(this.layerCount);

        for (let i = 0; i < this.neuron.length; i++) {
            this.neuron[i] = new Matrix(this.layerSize[i], 1);
        }
    }

    deltaInit() {
        this.delta = new Array(this.bunchSize).fill().map(() => new Array(this.layerCount - 1));

        this.delta.map(layerDelta => {
            for (let i = 0; i < layerDelta.length; i++) {
                layerDelta[i] = new Matrix(this.layerSize[i + 1], 1);
            }

            return layerDelta;
        });
    }

    gradientInit() {
        this.gradient = new Array(this.delta[0].length).fill().map((value, layerIndex) => {
            value = new Matrix(this.delta[0][layerIndex].row, this.delta[0][layerIndex].column);
            value.fillMatrix();
            return value;
        });
    }

//////initialization////////

    setInputData(value) {
        this.neuron[0] = value;
    }

    goThrowNetwork() {
        for (let i = 1; i < this.layerCount; i++) {
            this.neuron[i] = Matrix.multiply(this.weight[i - 1], this.neuron[i - 1]);
            this.neuron[i] = Matrix.add(this.neuron[i], this.bias[i - 1]);
            this.neuron[i] = Matrix.useFunction(this.neuron[i], this.activationFunction);
        }

        return {
            answer: this.getMoreActiveNeural(this.neuron[this.neuron.length - 1].matrix),
            output: this.neuron[this.neuron.length - 1].matrix
        };
    }

    getMoreActiveNeural(array) {
        return array.reduce((result, currentValue, currentIndex, array) => {
            return (currentValue > array[result]) ? currentIndex : result;
        }, 0);
    }

    calculateLastLayerGradient(rightAnswer){
        let lastLayer = this.layerCount - 2;

        for (let i = 0; i < this.layerSize[lastLayer + 1]; i++) {
            let derivation = this.activationFunctionDerivative(this.neuron[lastLayer + 1].matrix[i][0], false);
            let neuron = this.neuron[lastLayer + 1].matrix[i][0];

            if (i !== rightAnswer) {
                this.delta[this.bunchIndex][lastLayer].matrix[i][0] = 2 * neuron * derivation;
            } else {
                this.delta[this.bunchIndex][lastLayer].matrix[i][0] = 2 * (neuron - 1) * derivation
            }
        }
    }

    calculateGradient(layer){
        this.delta[this.bunchIndex][layer] = Matrix.multiply(
            Matrix.transpose(this.weight[layer + 1]),
            this.delta[this.bunchIndex][layer + 1]
        )

        for (let k = 0; k < this.delta[0][layer].row; k++) {
            let derivation = this.activationFunctionDerivative(this.neuron[layer + 1].matrix[k][0], false);
            this.delta[this.bunchIndex][layer].matrix[k][0] *= derivation;
        }
    }

    backPropagation(rightAnswer) {
        try {
            if (this.bunchIndex >= this.delta.length) {
                throw new Error("to much examples in a bunch");
            }

            this.calculateLastLayerGradient(rightAnswer);

            for (let layer = this.layerCount - 3; layer >= 0; layer--) {
                this.calculateGradient(layer);
            }

            this.bunchIndex++;
        } catch (err) {
            alert(`backpropagation error: ${err.message}`);
        }
    }

    calculateTotalGradient() {
        this.gradient.map((gradient, layerIndex) => {
            for (let i = 0; i < this.bunchIndex; i++) {
                gradient = Matrix.add(gradient, this.delta[i][layerIndex]);
            }

            for (let i = 0; i < gradient.row; i++) {
                for (let j = 0; j < gradient.column; j++) {
                    gradient.matrix[i][j] /= this.bunchSize;
                }
            }

            //gradient.matrix.map(row => row.map(value => value / this.bunchSize));
            this.gradient[layerIndex] = gradient;
        });
    }

    applyGradient(learningRate) {
/*        for (let layer = 0; layer < this.layerCount - 1; layer++) {
            for (let i = 0; i < this.layerSize[layer + 1]; i++) {
                this.bias[layer].matrix[i][0] -= this.gradient[layer].matrix[i][0] * learningRate;

                for (let j = 0; j < this.layerSize[layer]; j++) {
                    this.weight[layer].matrix[i][j] -=
                        this.neuron[layer].matrix[j][0] * this.gradient[layer].matrix[i][0] * learningRate;
                }
            }
        }*/
        for (let layer = 0; layer < this.layerCount - 1; layer++) {
            for (let i = 0; i < this.layerSize[layer + 1]; i++) {
                this.bias[layer].matrix[i][0] -= this.delta[0][layer].matrix[i][0] * learningRate;

                for (let j = 0; j < this.layerSize[layer]; j++) {
                    this.weight[layer].matrix[i][j] -=
                        this.neuron[layer].matrix[j][0] * this.delta[0][layer].matrix[i][0] * learningRate;
                }
            }
        }

        this.bunchIndex = 0;
        this.gradient.map(gradient => gradient.fillMatrix());
    }
}