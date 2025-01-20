class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static zero() {
        return new Vector(0, 0);
    }

    static normalize(vector) {
        const hyp = Vector.length(vector);
        if (hyp == 0) {
            return new Vector(0, 0);
        }
        return new Vector(vector.x / hyp, vector.y / hyp);
    }

    static addVectors(vectorA, vectorB) {
        return new Vector(vectorA.x + vectorB.x, vectorA.y + vectorB.y);
    }

    static substractVectors(vectorA, vectorB) {
        return new Vector(vectorA.x - vectorB.x, vectorA.y - vectorB.y);
    }

    static multiplyVectors(vectorA, vectorB) {
        return new Vector(vectorA.x * vectorB.x, vectorA.y * vectorB.y);
    }
    static divideVectors(vectorA, vectorB) {
        return new Vector(vectorA.x / vectorB.x, vectorA.y / vectorB.y);
    }

    static add(vector, b) {
        return new Vector(vector.x + b, vector.y + b);
    }
    static substract(vector, b) {
        return new Vector(vector.x - b, vector.y - b);
    }

    static multiply(vector, b) {
        return new Vector(vector.x * b, vector.y * b);
    }

    static divide(vector, b) {
        return new Vector(vector.x / b, vector.y / b);
    }

    static absVector(vector) {
        return new Vector(Math.abs(vector.x), Math.abs(vector.y));
    }

    static reverse(vector) {
        return new Vector(-vector.x, -vector.y);
    }

    static length(vector) {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }

    static dot(vectorA, vectorB) {
        return vectorA.x * vectorB.x + vectorA.y * vectorB.y;
    }

    static minVectors(vectorA, vectorB) {
        if (this.length(vectorA) <= this.length(vectorB)) {
            return vectorA;
        }
        return vectorB;
    }
    static truncate(vector, b) {
        const vectorLength = this.length(vector);

        if (vectorLength <= b) {
            return vector;
        }

        return this.multiply(this.normalize(vector), b);
    }

    static distanceTo(vectorA, vectorB) {
        const offset = this.substractVectors(vectorA, vectorB);
        return this.length(offset);
    }

    static crossProduct(vector, magnitude) {
        if (magnitude === 0) {
            return this.zero();
        }
        return new Vector(vector.y / magnitude, -vector.x / magnitude);
    }

}

export { Vector };