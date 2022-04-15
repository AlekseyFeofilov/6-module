import {examples} from "../Data/MNIST_60K_Training.js"
import {testExamples} from "../Data/MNIST_10K_Testing.js"
import {Matrix} from "../Math/Matrix.js";

export {MNISTReader}

class MNISTReader {
    constructor(goal) {
        this.MNIST = (goal === "training") ? JSON.parse(examples) : JSON.parse(testExamples);
        this.index = 0;
    }

    reload(){
        this.index = 0;
    }

    hasExample() {
        return this.index < this.MNIST.length;
    }

    getNextExample() {
        if (!this.hasExample()) return null;

        let matrix = Matrix.arrayTo2DSquareMatrix(this.MNIST[this.index].slice(1), true);
        return {'digit': this.MNIST[this.index++][0], 'pixels': matrix}
    }

    getNextBunch(bunchSize) {
        let data = [];

        for(let i = 0; i < bunchSize; i++){
            data.push(this.getNextExample());

            if(data[data.length - 1] === null) {
                data.pop();
                break;
            }
        }

        return data;
    }
}
