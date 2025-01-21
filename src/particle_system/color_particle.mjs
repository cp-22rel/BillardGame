import { Particle } from "./particle.mjs";
import { Vector } from "../vector.mjs";

class ColorParticle extends Particle {
    constructor(color, lifeTime, position, velocity, size, sizeModifier, angle, ignorePause) {
        super(position, lifeTime, ignorePause);

        this.color = color;
        super.velocity = velocity;
        super.size = size;
        super.angle = angle ?? 0;
        this.sizeModifier = sizeModifier;
    }

    update() {
        this.lifeTime--;
        this.position = Vector.addVectors(this.position, this.velocity);
        this.angle += this.angularVelocity;
        this.size = Vector.addVectors(this.size, this.sizeModifier);
    }

    render(context) {
        context.fillStyle = this.color;
        context.translate(this.position.x, this.position.y);
        context.rotate(this.angle);
        context.translate(-this.position.x, -this.position.y);
        context.fillRect(this.position.x - this.size.x / 2, this.position.y - this.size.y / 2, this.size.x, this.size.y);
        context.setTransform(1, 0, 0, 1, 0, 0);
    }
}

export { ColorParticle };