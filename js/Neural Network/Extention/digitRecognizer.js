import {NeuralNetwork} from "./neuralNetwork.js";
//import {MNISTReader} from "./MNISTReader.js";
import {weight1} from "../Data/weight1.js";
import {weight2} from "../Data/weight2.js";
import {bias1} from "../Data/bias1.js";
import {bias2} from "../Data/bias2.js";
import {completeReport, report} from "../script.js";
import {formatTime} from "./time.js";
import {dataNetwork} from "../Data/properties.js";

export class DigitRecognizer {
    constructor() {
        this.neuralNetworks = new NeuralNetwork();
        this.accuracy = [];
        this.stopTraining = false;
    }

    synchronize() {
        dataNetwork.layerCount = 3;
        dataNetwork.epochCount = 30;
        dataNetwork.layerSize = [784, 256, 10];

        this.neuralNetworks = new NeuralNetwork();

        this.neuralNetworks.weight[0].matrix = weight1;
        this.neuralNetworks.weight[1].matrix = weight2;

        this.neuralNetworks.bias[0].matrix = bias1;
        this.neuralNetworks.bias[1].matrix = bias2;
    }

    timeDifference() {
        let time = Date.now() - this.startTime;
        return formatTime(time);
    }

    train() {
        this.startTime = Date.now();

        this.data = new MNISTReader("training");
        this.epoch = 0;

        this.training();
    }

    continueTraining() {
        this.stopTraining = false;
        this.training()
    }

    delayTraining() {
        this.stopTraining = true;
    }

    training() {
        if (this.stopTraining) {
            return;
        }

        if (this.epoch >= this.neuralNetworks.epochCount) {
            completeReport(this.timeDifference());
            return;
        }

        setTimeout(() => this.training());

        if (!this.data.hasExample()) {
            this.accuracy.push(this.test());
            this.epoch++;

            report(this.timeDifference());

            this.data.reload();
            return;
        }

        let bunch = this.data.getNextBunch(this.neuralNetworks.bunchSize);

        for (let i = 0; i < bunch.length; i++) {
            if (bunch[i].digit !== this.recognize(bunch[i]).answer) {
                this.neuralNetworks.backPropagation(bunch[i].digit);
                this.neuralNetworks.applyGradient(0.01 * Math.exp(-this.epoch / 40));
            }
        }

        //this.neuralNetworks.calculateGradient();
        //this.neuralNetworks.applyGradient(0.15 * Math.exp(-this.data.index * 30 / this.data.MNIST.length));
        //this.neuralNetworks.applyGradient(1);
    }

    test() {
        this.data = new MNISTReader("testing");
        let rightAnswer = 0;

        while (this.data.hasExample()) {
            let example = this.data.getNextExample();

            if (example.digit === this.recognize(example).answer) {
                rightAnswer++;
            }
        }

        return rightAnswer / this.data.MNIST.length;
    }

    recognize(input) {
        this.neuralNetworks.setInputData(input.pixels);
        return this.neuralNetworks.goThrowNetwork();
    }
}