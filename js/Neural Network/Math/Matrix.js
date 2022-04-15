import {random} from "./Random.js";
import {Dependence} from "./Enums.js";

export class Matrix {
    constructor(row, column) {
        this.row = row;
        this.column = column;

        this.matrix = new Array(this.row).fill().map(() => new Array(this.column));
    }

    setDependency(dependenceType, row) {
        switch (dependenceType) {
            case Dependence.WEIGHT:
                return function () {
                    return random(0, 100) * 0.03 / (row + 35);
                }
            case Dependence.BIAS:
                return function () {
                    return random(0, 50) * 0.06 / (row + 15);
                }
            case Dependence.RANDOM:
                return function () {
                    return random(-100, 100);
                }
            default:
                return function () {
                    return 0;
                }
        }
    }

    fillMatrix(dependenceType = Dependence.ZERO) {
        let dependency = this.setDependency(dependenceType, this.row);

        this.matrix = Array.from(this.matrix, row => Array.from(row, () => dependency()));
    }

    static multiply(matrix1, matrix2) {
        try {
            if (matrix1.column !== matrix2.row) {
                throw new Error("matrix1 column number don't equals matrix2 row number");
            }

            let result = new Matrix(matrix1.row, matrix2.column);
            result.fillMatrix();

            for (let i = 0; i < matrix1.row; i++) {
                for (let j = 0; j < matrix2.column; j++) {
                    for (let k = 0; k < matrix1.column; k++) {
                        result.matrix[i][j] += matrix1.matrix[i][k] * matrix2.matrix[k][j];
                    }
                }
            }

            return result;
        } catch (err) {
            alert(`Multiple error: ${err.message}`);
        }
    }

    static add(matrix1, matrix2) {
        try {
            if (matrix1.row !== matrix2.row || matrix1.column !== matrix2.column) {
                throw new Error("matrix1 column and row number don't equals matrix2 column and row number");
            }

            let result = new Matrix(matrix1.row, matrix1.column);

            for (let i = 0; i < matrix1.row; i++) {
                for (let j = 0; j < matrix1.column; j++) {
                    result.matrix[i][j] = matrix1.matrix[i][j] + matrix2.matrix[i][j];
                }
            }

            return result;
        } catch (err) {
            alert(`addition error: ${err.message}`);
        }
    }

    static arrayTo2DSquareMatrix(array, transposed = false) {
        let matrix = (array[0].length !== undefined) ?
            new Matrix(array.length, array[0].length) :
            new Matrix(1, array.length);

        matrix.matrix = (array[0].length !== undefined) ? array : [array];
        return (transposed) ? this.transpose(matrix) : matrix;
    }

    static transpose(matrix) {
        let transposedMatrix = new Matrix(matrix.column, matrix.row);

        for (let i = 0; i < matrix.row; i++) {
            for (let j = 0; j < matrix.column; j++) {
                transposedMatrix.matrix[j][i] = matrix.matrix[i][j];
            }
        }

        return transposedMatrix;
    }

    static useFunction(matrix, someFunction, flag = true) {
        let newMatrix = new Matrix(matrix.row, matrix.column);

        for (let i = 0; i < newMatrix.row; i++) {
            for (let j = 0; j < newMatrix.column; j++) {
                newMatrix.matrix[i][j] = someFunction(matrix.matrix[i][j], flag);
            }
        }

        return newMatrix;
    }
}