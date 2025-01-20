import { Vector } from "./vector.mjs";

class VisualVector {
    constructor(startPosition, endPosition) {
        this.startPosition = startPosition;
        this.endPosition = endPosition;
        this.image = new Image();
        this.image.src = "./assets/arrow.png";
    }

    render(context) {
        context.strokeStyle = "black";

        const offset = Vector.substractVectors(this.startPosition, this.endPosition);
        const angle = Math.atan2(offset.y, offset.x);

        context.strokeStyle = "white";
        context.beginPath();
        context.moveTo(this.startPosition.x, this.startPosition.y);

        const multipliedDirection = (Vector.addVectors(this.startPosition, Vector.multiply(Vector.normalize(offset), 1000)));

        context.lineTo(multipliedDirection.x, multipliedDirection.y);
        context.stroke();


        context.translate(this.startPosition.x, this.startPosition.y);
        context.rotate(angle);
        context.translate(-this.startPosition.x, -this.startPosition.y);
        context.drawImage(this.image, this.startPosition.x, this.startPosition.y - 25, Math.min(Vector.length(offset) + 30, 400), 50);


        context.translate(this.startPosition.x, this.startPosition.y);
        context.rotate(-angle);
        context.translate(-this.startPosition.x, -this.startPosition.y);
    }
}

export { VisualVector };